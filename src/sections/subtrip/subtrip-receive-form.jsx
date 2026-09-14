import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Grid,
  Card,
  Stack,
  Paper,
  Alert,
  Button,
  Divider,
  MenuItem,
  Typography,
  LinearProgress,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useFieldHelpers } from 'src/hooks/use-form-config';

import {
  useSubtrip,
  useUpdateSubtripReceiveInfo,
  getSubtripDocumentUploadUrl,
} from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { APP_ICONS } from 'src/components/iconify/icons';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { getWeightUnit } from './utils';
import { receiveSchema } from './subtrip-schemas';
import { BasicExpenseTable } from './widgets/basic-expense-table';
import { SubtripDetailCard } from './widgets/subtrip-detail-card';
import { SUBTRIP_STATUS, CONCRETE_FREIGHT_MODEL_OPTIONS } from './constants';
import { KanbanSubtripDialog } from '../kanban/components/kanban-subtrip-dialog';
import { SubtripReceiveSettlementSummary } from './widgets/subtrip-receive-settlement-summary';

const defaultValues = {
  subtripId: '',
  endDate: new Date(),
  unloadingWeight: 0,
  commissionDetails: {
    commissionRate: 0,
    commissionAmount: 0,
  },
  freightDetails: {
    freightAmount: 0,
    endKm: '',
    endTime: null,
  },
  hasShortage: false,
  hasError: false,
  shortageWeight: 0,
  shortageAmount: 0,
  remarks: '',
  errorRemarks: '',
  docs: [],
};

const getInitialReceiveValues = (subtrip, isRequired) => {
  if (!subtrip) return defaultValues;

  const rawFreightModel = subtrip.freightDetails?.freightModel;
  const isDeferred = rawFreightModel === 'to_be_billed';
  const freightModel = isDeferred ? '' : (rawFreightModel || 'per_ton');
  const isOwn = subtrip.vehicleId?.isOwn ?? true;
  const loadingWeight = Number(subtrip.loadingWeight || 0);
  const unloadingWeight =
    subtrip.unloadingWeight && Number(subtrip.unloadingWeight) > 0
      ? Number(subtrip.unloadingWeight)
      : loadingWeight;
  const freightRate = isDeferred ? '' : Number(subtrip.freightDetails?.rate || 0);
  const commissionRate = Number(subtrip.commissionDetails?.commissionRate || 0);

  let freightAmount = isDeferred ? 0 : Number(subtrip.freightDetails?.freightAmount || 0);
  if (!isDeferred && (freightModel === 'per_ton' || freightModel === 'per_kl')) {
    freightAmount = loadingWeight * Number(freightRate || 0);
  }

  let commissionAmount = Number(subtrip.commissionDetails?.commissionAmount || 0);
  if (!isOwn && !isDeferred && (freightModel === 'per_ton' || freightModel === 'per_kl')) {
    commissionAmount = commissionRate * loadingWeight;
  }

  return {
    ...defaultValues,
    subtripId: subtrip._id,
    endDate: subtrip.endDate ? new Date(subtrip.endDate) : new Date(),
    unloadingWeight,
    commissionDetails: {
      commissionRate,
      commissionAmount,
    },
    freightDetails: {
      freightModel,
      rate: freightRate,
      freightAmount,
      baseKm: subtrip.freightDetails?.baseKm ?? '',
      startKm: subtrip.freightDetails?.startKm ?? 0,
      endKm: subtrip.freightDetails?.endKm ?? '',
      endTime: subtrip.freightDetails?.endTime || null,
    },
    hasShortage: Boolean(
      subtrip.hasShortage || (subtrip.shortageWeight && Number(subtrip.shortageWeight) > 0)
    ),
    hasError: Boolean(subtrip.hasError),
    shortageWeight: Number(subtrip.shortageWeight || 0),
    shortageAmount: Number(subtrip.shortageAmount || 0),
    remarks: subtrip.remarks || '',
    errorRemarks: subtrip.errorRemarks || '',
    docs: subtrip.docs || [],

    // Schema helper context fields
    freightModel,
    startKm: subtrip.freightDetails?.startKm || 0,
    loadingWeight,
    isOwn,
    unloadingWeightRequired: isRequired ? isRequired('unloadingWeight') : false,
    remarksRequired: isRequired ? isRequired('remarks') : false,
  };
};

const ReceiveFormFields = ({ selectedSubtrip, methods, errors, subtripDialog, isLoading }) => {
  const { watch, setValue } = methods;
  const {
    hasError,
    hasShortage,
    unloadingWeight,
    commissionDetails,
    freightDetails,
    endDate,
    shortageAmount,
    shortageWeight,
  } = watch();
  const { isOwn } = selectedSubtrip?.vehicleId || {};

  const isDeferredFreight = selectedSubtrip?.freightDetails?.freightModel === 'to_be_billed';
  const activeFreightModel = isDeferredFreight
    ? (freightDetails?.freightModel || '')
    : (selectedSubtrip?.freightDetails?.freightModel || 'per_ton');

  const customerId = selectedSubtrip?.customerId?._id || selectedSubtrip?.customerId;
  const { getLabel, isRequired, freightConfig } = useFieldHelpers('subtrip', customerId);

  const availableFreightModelOptions = useMemo(() => {
    const allowed = freightConfig?.allowedModels || [];
    const filtered = CONCRETE_FREIGHT_MODEL_OPTIONS.filter(
      (opt) => !allowed.length || allowed.includes(opt.value)
    );
    return filtered.length > 0 ? filtered : CONCRETE_FREIGHT_MODEL_OPTIONS;
  }, [freightConfig?.allowedModels]);

  // Sync configurable field flags if tenant config changes
  useEffect(() => {
    if (!selectedSubtrip) return;
    setValue('unloadingWeightRequired', isRequired('unloadingWeight'));
    setValue('remarksRequired', isRequired('remarks'));
  }, [selectedSubtrip, isRequired, setValue]);

  // Keep top-level freightModel schema context in sync with active model
  useEffect(() => {
    setValue('freightModel', activeFreightModel);
  }, [activeFreightModel, setValue]);

  const loadingWeight = Number(selectedSubtrip?.loadingWeight || 0);
  const currentUnloading = Number(unloadingWeight || 0);
  const weightDiff =
    selectedSubtrip?.loadingWeight && unloadingWeight !== '' && unloadingWeight !== undefined
      ? Number((currentUnloading - loadingWeight).toFixed(3))
      : 0;

  // Auto-calculate commission amount based on commissionRate and loadingWeight for per_ton / per_kl model
  useEffect(() => {
    if (!selectedSubtrip || isOwn || (activeFreightModel !== 'per_ton' && activeFreightModel !== 'per_kl'))
      return;

    const rate = Number(commissionDetails?.commissionRate || 0);
    const weight = Number(selectedSubtrip.loadingWeight || 0);
    setValue('commissionDetails.commissionAmount', rate * weight, { shouldValidate: true });
  }, [commissionDetails?.commissionRate, selectedSubtrip, activeFreightModel, isOwn, setValue]);

  // Auto-calculate freight amount based on model parameters
  useEffect(() => {
    if (!selectedSubtrip || !activeFreightModel || activeFreightModel === 'to_be_billed') return;

    const rate = Number(
      freightDetails?.rate !== undefined && freightDetails?.rate !== ''
        ? freightDetails.rate
        : (selectedSubtrip.freightDetails?.rate || 0)
    );

    if (activeFreightModel === 'per_ton' || activeFreightModel === 'per_kl') {
      setValue('freightDetails.freightAmount', rate * loadingWeight, {
        shouldValidate: true,
      });
    } else if (activeFreightModel === 'fixed') {
      if (freightDetails?.freightAmount !== undefined) {
        setValue('freightDetails.freightAmount', Number(freightDetails.freightAmount) || 0, {
          shouldValidate: true,
        });
      }
    } else if (activeFreightModel === 'per_km' && freightDetails?.endKm) {
      const startKm = Number(
        freightDetails?.startKm !== undefined && freightDetails?.startKm !== ''
          ? freightDetails.startKm
          : (selectedSubtrip.freightDetails?.startKm || 0)
      );
      const endKm = Number(freightDetails.endKm);
      if (endKm > startKm) {
        setValue('freightDetails.freightAmount', (endKm - startKm) * rate, {
          shouldValidate: true,
        });
      }
    } else if (activeFreightModel === 'hybrid' && freightDetails?.endKm) {
      const startKm = Number(
        freightDetails?.startKm !== undefined && freightDetails?.startKm !== ''
          ? freightDetails.startKm
          : (selectedSubtrip.freightDetails?.startKm || 0)
      );
      const endKm = Number(freightDetails.endKm);
      const baseKm = Number(
        freightDetails?.baseKm !== undefined && freightDetails?.baseKm !== ''
          ? freightDetails.baseKm
          : (selectedSubtrip.freightDetails?.baseKm || 0)
      );
      const baseFreight = Number(
        freightDetails?.freightAmount !== undefined && freightDetails?.freightAmount !== ''
          ? freightDetails.freightAmount
          : (selectedSubtrip.freightDetails?.freightAmount || 0)
      );
      const totalKm = endKm > startKm ? endKm - startKm : 0;

      if (totalKm > baseKm && rate > 0) {
        const extraKm = totalKm - baseKm;
        setValue('freightDetails.freightAmount', baseFreight + extraKm * rate, {
          shouldValidate: true,
        });
      }
    } else if (activeFreightModel === 'per_hour' && endDate) {
      const startTime = selectedSubtrip.startDate;
      if (startTime) {
        const start = dayjs(startTime);
        const end = dayjs(endDate);
        const diffInHours = Math.ceil(end.diff(start, 'hour', true));
        if (diffInHours > 0) {
          setValue('freightDetails.freightAmount', diffInHours * rate, { shouldValidate: true });
        }
      }
    }
  }, [
    activeFreightModel,
    freightDetails?.rate,
    freightDetails?.endKm,
    freightDetails?.baseKm,
    freightDetails?.startKm,
    freightDetails?.freightAmount,
    endDate,
    loadingWeight,
    selectedSubtrip,
    setValue,
  ]);

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      const currentDocs = watch('docs') || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const totalFiles = [...currentDocs, ...newFiles];
      if (totalFiles.length > 5) {
        setValue('docs', totalFiles.slice(0, 5), { shouldValidate: true });
      } else {
        setValue('docs', totalFiles, { shouldValidate: true });
      }
    },
    [setValue, watch]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const currentDocs = watch('docs') || [];
      const filtered = currentDocs.filter((file) => file !== inputFile);
      setValue('docs', filtered, { shouldValidate: true });
    },
    [setValue, watch]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('docs', [], { shouldValidate: true });
  }, [setValue]);

  return (
    <Card sx={{ p: 2, height: '100%' }}>
      {isLoading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
          <LinearProgress color="info" size={24} sx={{ mt: 1 }} />
        </Box>
      )}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Iconify icon={APP_ICONS.job} sx={{ color: 'primary.main' }} />
        <Typography variant="h6">Job Receive Details</Typography>
      </Stack>

      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
        <DialogSelectButton
          onClick={subtripDialog.onTrue}
          placeholder="Select Job *"
          selected={selectedSubtrip?.subtripNo}
          error={!!errors.subtripId?.message}
          iconName={APP_ICONS.job}
          sx={{ gridColumn: '1 / -1' }}
        />

        {selectedSubtrip && (
          <>
            {isDeferredFreight && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  This job was created with <strong>To Be Billed Later</strong>. You must select a concrete freight model and enter billing rates to complete receive.
                </Alert>
                <Field.Select name="freightDetails.freightModel" label="Freight Model *">
                  {availableFreightModelOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Box>
            )}

            {isDeferredFreight && (activeFreightModel === 'per_ton' || activeFreightModel === 'per_kl') && (
              <Field.Text
                name="freightDetails.rate"
                label={activeFreightModel === 'per_kl' ? 'Freight Rate (Per KL) *' : 'Freight Rate (Per Ton) *'}
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                }}
              />
            )}

            {isDeferredFreight && activeFreightModel === 'fixed' && (
              <Field.Text
                name="freightDetails.freightAmount"
                label="Freight Amount *"
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                }}
              />
            )}

            {isDeferredFreight && activeFreightModel === 'hybrid' && (
              <>
                <Field.Text
                  name="freightDetails.freightAmount"
                  label="Base Freight Amount *"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                  }}
                />
                <Field.Text
                  name="freightDetails.baseKm"
                  label="Base KM *"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">km</InputAdornment>,
                  }}
                />
                <Field.Text
                  name="freightDetails.rate"
                  label="Extra Rate (Per KM) *"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                  }}
                />
              </>
            )}

            {isDeferredFreight && activeFreightModel === 'per_km' && (
              <Field.Text
                name="freightDetails.rate"
                label="Rate (Per KM) *"
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                }}
              />
            )}

            {isDeferredFreight && activeFreightModel === 'per_hour' && (
              <Field.Text
                name="freightDetails.rate"
                label="Rate (Per Hour) *"
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                }}
              />
            )}

            <Field.Configurable entity="subtrip" name="unloadingWeight" customerId={customerId}>
              <Stack spacing={0.5}>
                <Field.Text
                  name="unloadingWeight"
                  label={getLabel(
                    'unloadingWeight',
                    activeFreightModel === 'per_kl' ? 'Unloading Volume (KL)' : 'Unloading Weight'
                  )}
                  type="number"
                  required={
                    activeFreightModel === 'per_ton' ||
                    activeFreightModel === 'per_kl' ||
                    isRequired('unloadingWeight')
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {getWeightUnit(selectedSubtrip)}
                      </InputAdornment>
                    ),
                  }}
                />

                {weightDiff !== 0 && (
                  <Typography
                    variant="caption"
                    sx={{
                      px: 0.5,
                      fontWeight: 600,
                      color: weightDiff < 0 ? 'error.main' : 'warning.main',
                    }}
                  >
                    {weightDiff > 0 ? `+${weightDiff}` : weightDiff} {getWeightUnit(selectedSubtrip)}
                  </Typography>
                )}
              </Stack>
            </Field.Configurable>

            {isOwn ? null : activeFreightModel === 'per_ton' || activeFreightModel === 'per_kl' ? (
              <Field.Configurable entity="subtrip" name="commissionRate" customerId={customerId}>
                <Field.Text
                  name="commissionDetails.commissionRate"
                  label={getLabel('commissionRate', 'Transporter Commission Rate')}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Iconify icon="mdi:currency-inr" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Field.Configurable>
            ) : (
              <Field.Configurable entity="subtrip" name="commissionAmount" customerId={customerId}>
                <Field.Text
                  name="commissionDetails.commissionAmount"
                  label={getLabel('commissionAmount', 'Transporter Commission Amount')}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Iconify icon="mdi:currency-inr" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Field.Configurable>
            )}

            <Field.MobileDateTimePicker name="endDate" label="LR Receive Date *" />

            {(activeFreightModel === 'per_km' || activeFreightModel === 'hybrid') && (
              <Field.Configurable entity="subtrip" name="endKm" customerId={customerId}>
                <Field.Text
                  name="freightDetails.endKm"
                  label={getLabel('endKm', 'Billing End KM')}
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">km</InputAdornment>,
                  }}
                />
              </Field.Configurable>
            )}

            <SubtripReceiveSettlementSummary
              selectedSubtrip={selectedSubtrip}
              freightDetails={freightDetails}
              commissionDetails={commissionDetails}
              hasShortage={hasShortage}
              shortageAmount={shortageAmount}
              shortageWeight={shortageWeight}
              endDate={endDate}
            />
          </>
        )}
      </Box>

      {selectedSubtrip && (
        <>
          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Field.Switch name="hasShortage" label="Has Shortage" color="warning" />
            <Field.Switch name="hasError" label="Has Error" color="error" />
          </Stack>

          {hasShortage && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="warning.main" gutterBottom>
                Shortage Details
              </Typography>
              <Stack direction="row" spacing={2}>
                <Field.Configurable entity="subtrip" name="shortageWeight" customerId={customerId}>
                  <Field.Number
                    name="shortageWeight"
                    label={getLabel(
                      'shortageWeight',
                      activeFreightModel === 'per_kl' ? 'Shortage Volume (KL)' : 'Shortage Weight'
                    )}
                    helperText=""
                    placeholder="0"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {getWeightUnit(selectedSubtrip)}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Field.Configurable>
                <Field.Configurable entity="subtrip" name="shortageAmount" customerId={customerId}>
                  <Field.Text
                    name="shortageAmount"
                    label={getLabel('shortageAmount', 'Shortage Amount')}
                    type="number"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Iconify icon="mdi:currency-inr" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Field.Configurable>
              </Stack>
            </Box>
          )}

          {hasError && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="error.main" gutterBottom>
                Error Details
              </Typography>
              <Field.Text
                name="errorRemarks"
                label="Error Remarks *"
                type="text"
                multiline
                rows={3}
              />
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Documents (Optional)
            </Typography>
            <Field.Upload
              multiple
              name="docs"
              maxSize={3145728}
              accept={{ 'image/*': [], 'application/pdf': [] }}
              onDrop={handleDropMultiFile}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
          </Box>
        </>
      )}

      <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
        {unloadingWeight > selectedSubtrip?.loadingWeight && (
          <Alert severity="error" variant="outlined">
            Unloading weight cannot be more than loading weight
          </Alert>
        )}
        {!isOwn &&
          (activeFreightModel === 'per_ton' || activeFreightModel === 'per_kl') &&
          commissionDetails?.commissionRate > (freightDetails?.rate || selectedSubtrip?.freightDetails?.rate || 0) && (
            <Alert severity="error" variant="outlined">
              Commission rate cannot be more than the freight rate
            </Alert>
          )}
        {!isOwn &&
          activeFreightModel !== 'per_ton' &&
          activeFreightModel !== 'per_kl' &&
          commissionDetails?.commissionAmount > (freightDetails?.freightAmount || selectedSubtrip?.freightDetails?.freightAmount || 0) && (
            <Alert severity="error" variant="outlined">
              Commission amount cannot be more than the freight amount
            </Alert>
          )}
      </Stack>
    </Card>
  );
};

export function SubtripReceiveForm({ currentSubtrip: currentSubtripProp }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSubtripId =
    (typeof currentSubtripProp === 'object' ? currentSubtripProp?._id : currentSubtripProp) ||
    searchParams.get('currentSubtrip');
  const redirectTo = searchParams.get('redirectTo');

  const subtripDialog = useBoolean();
  const [selectedSubtripId, setSelectedSubtripId] = useState(() => currentSubtripId || null);

  const { data: selectedSubtripData, isLoading: isLoadingSelectedSubtrip } =
    useSubtrip(selectedSubtripId);

  const customerId = selectedSubtripData?.customerId?._id || selectedSubtripData?.customerId;
  const { isRequired } = useFieldHelpers('subtrip', customerId);

  const receiveSubtrip = useUpdateSubtripReceiveInfo();

  const methods = useForm({
    resolver: zodResolver(receiveSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const lastLoadedSubtripIdRef = useRef(null);

  // Sync selectedSubtripId when currentSubtripId URL parameter changes
  useEffect(() => {
    if (currentSubtripId && currentSubtripId !== selectedSubtripId) {
      lastLoadedSubtripIdRef.current = null;
      setSelectedSubtripId(currentSubtripId);
    }
  }, [currentSubtripId, selectedSubtripId]);

  // Populate form whenever selectedSubtripData is loaded or changes to a new subtrip
  useEffect(() => {
    if (selectedSubtripData && selectedSubtripData._id !== lastLoadedSubtripIdRef.current) {
      lastLoadedSubtripIdRef.current = selectedSubtripData._id;
      reset(getInitialReceiveValues(selectedSubtripData, isRequired));
    }
  }, [selectedSubtripData, reset, isRequired]);

  const { unloadingWeight, commissionDetails } = watch();
  const { isOwn } = selectedSubtripData?.vehicleId || {};

  const handleSubtripChange = useCallback((subtrip) => {
    if (!subtrip?._id) return;
    lastLoadedSubtripIdRef.current = null;
    setSelectedSubtripId(subtrip._id);
  }, []);

  const handleResetForm = useCallback(() => {
    lastLoadedSubtripIdRef.current = null;
    setSelectedSubtripId(null);
    reset(defaultValues);
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      let uploadedDocs = [];
      if (data.docs && data.docs.length > 0) {
        uploadedDocs = await Promise.all(
          data.docs.map(async (file) => {
            if (typeof file === 'string') return file;
            const fileExtension = file.name.split('.').pop() || 'pdf';
            const contentType = file.type || 'application/pdf';
            const resUrl = await getSubtripDocumentUploadUrl({ contentType, fileExtension });
            const res = await fetch(resUrl.uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': contentType },
              body: file,
            });
            if (!res.ok) throw new Error('Upload failed');
            return resUrl.publicUrl;
          })
        );
      }

      const submissionData = { ...data, docs: uploadedDocs };

      await receiveSubtrip({ id: selectedSubtripData._id, data: submissionData });
      lastLoadedSubtripIdRef.current = null;
      setSelectedSubtripId(null);
      reset(defaultValues);
      if (redirectTo) navigate(redirectTo);
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  const isDeferredFreight = selectedSubtripData?.freightDetails?.freightModel === 'to_be_billed';
  const activeFreightModel = isDeferredFreight
    ? watch('freightDetails.freightModel')
    : (selectedSubtripData?.freightDetails?.freightModel || 'per_ton');

  const isFreightModelPending = isDeferredFreight && !watch('freightDetails.freightModel');

  const effectiveRate = Number(
    watch('freightDetails.rate') !== undefined && watch('freightDetails.rate') !== ''
      ? watch('freightDetails.rate')
      : (selectedSubtripData?.freightDetails?.rate || 0)
  );

  const effectiveFreightAmount = Number(
    watch('freightDetails.freightAmount') !== undefined && watch('freightDetails.freightAmount') !== ''
      ? watch('freightDetails.freightAmount')
      : (selectedSubtripData?.freightDetails?.freightAmount || 0)
  );

  const isOverweight = unloadingWeight > (selectedSubtripData?.loadingWeight || 0);
  const isCommissionExceeded =
    !isOwn &&
    (activeFreightModel === 'per_ton' || activeFreightModel === 'per_kl'
      ? commissionDetails?.commissionRate > effectiveRate
      : commissionDetails?.commissionAmount > effectiveFreightAmount);

  const isSubmitDisabled = !isValid || isSubmitting || isOverweight || isCommissionExceeded || isFreightModelPending;

  return (
    <>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Form Section */}
          <Grid item xs={12} md={5}>
            <ReceiveFormFields
              selectedSubtrip={selectedSubtripData}
              methods={methods}
              errors={errors}
              subtripDialog={subtripDialog}
              isLoading={isLoadingSelectedSubtrip}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleResetForm}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={isSubmitDisabled}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={7}>
            {selectedSubtripData ? (
              <Stack spacing={2}>
                <SubtripDetailCard
                  selectedSubtrip={selectedSubtripData}
                  commissionRate={watch('commissionDetails.commissionRate')}
                  commissionAmount={watch('commissionDetails.commissionAmount')}
                />
                <BasicExpenseTable selectedSubtrip={selectedSubtripData} />
              </Stack>
            ) : (
              <Paper
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  minHeight: 300,
                  bgcolor: 'background.neutral',
                }}
              >
                <Iconify
                  icon="mdi:truck-fast-outline"
                  sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  Select a job to view details
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, textAlign: 'center' }}
                >
                  Choose a job from the form to see its details and expenses
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Form>

      <KanbanSubtripDialog
        open={subtripDialog.value}
        onClose={subtripDialog.onFalse}
        selectedSubtrip={selectedSubtripData}
        onSubtripChange={handleSubtripChange}
        statusList={[SUBTRIP_STATUS.LOADED]}
        dialogTitle="Select Job to Receive"
      />
    </>
  );
}
