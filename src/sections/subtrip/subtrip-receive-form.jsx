import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Stack,
  Button,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useUpdateSubtripReceiveInfo } from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { SUBTRIP_STATUS } from './constants';
import { loadingWeightUnit } from '../vehicle/vehicle-config';
import { KanbanSubtripDialog } from '../kanban/components/kanban-subtrip-dialog';

// ----------------------------------------------------------------------

const validationSchema = zod
  .object({
    unloadingWeight: zod.number({ required_error: 'Unloading weight is required' }),
    endKm: zod.number({ required_error: 'End Km is required' }).optional(),
    commissionRate: zod
      .number()
      .min(0, { message: 'Commission rate cannot be negative' })
      .optional(),
    hasError: zod.boolean(),
    errorRemarks: zod.string().optional(),
    shortageWeight: zod.number().optional(),
    shortageAmount: zod.number().optional(),
    hasShortage: zod.boolean(),
    invoiceNo: zod.string().optional(),
    rate: zod.number().optional(),
  })
  .superRefine((values, ctx) => {
    // Validate unloadingWeight <= loadingWeight if loadingWeight is available
    if (values.loadingWeight && values.unloadingWeight > values.loadingWeight) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'Unloading weight must be less than or equal to loading weight',
        path: ['unloadingWeight'],
      });
    }

    // Validate endKm >= startKm if both are available
    if (values.startKm && values.endKm && values.endKm < values.startKm) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'End Km must be greater than or equal to Start Km',
        path: ['endKm'],
      });
    }
  });

// ----------------------------------------------------------------------

export function SubtripReceiveForm({ currentSubtrip }) {
  const [selectedSubtrip, setSelectedSubtrip] = useState(currentSubtrip || null);
  const subtripDialog = useBoolean(false);
  const receiveSubtrip = useUpdateSubtripReceiveInfo();

  const defaultValues = useMemo(
    () => ({
      unloadingWeight: selectedSubtrip?.loadingWeight || 0,
      endKm: selectedSubtrip?.startKm || 0,
      commissionRate: 0,
      hasError: false,
      errorRemarks: '',
      shortageWeight: 0,
      shortageAmount: 0,
      hasShortage: false,
      loadingWeight: selectedSubtrip?.loadingWeight || 0,
      startKm: selectedSubtrip?.startKm || 0,
      invoiceNo: selectedSubtrip?.invoiceNo || '',
      rate: selectedSubtrip?.rate || 0,
    }),
    [selectedSubtrip]
  );

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = methods;

  const { hasError, hasShortage, commissionRate, rate } = watch();

  // Update form values when selectedSubtrip changes
  useEffect(() => {
    if (selectedSubtrip) {
      reset({
        ...defaultValues,
        unloadingWeight: selectedSubtrip.loadingWeight || 0,
        endKm: selectedSubtrip.startKm || 0,
        loadingWeight: selectedSubtrip.loadingWeight || 0,
        startKm: selectedSubtrip.startKm || 0,
        invoiceNo: selectedSubtrip.invoiceNo || '',
        rate: selectedSubtrip.rate || 0,
      });
    }
  }, [selectedSubtrip, reset, defaultValues]);

  // update effective rate when commission rate is changed
  useEffect(() => {
    if (commissionRate) {
      setValue('effectiveRate', rate - commissionRate);
    }
  }, [commissionRate, rate, setValue]);

  const handleSubtripChange = (subtrip) => {
    setSelectedSubtrip(subtrip);
  };

  const onSubmit = async (data) => {
    try {
      if (!selectedSubtrip) {
        console.error('No subtrip selected');
        return;
      }

      await receiveSubtrip({ id: selectedSubtrip._id, data });

      // Reset form after successful submission
      reset({
        endKm: 0,
        startKm: 0,
        loadingWeight: 0,
        unloadingWeight: 0,
        commissionRate: 0,
        hasShortage: false,
        hasError: false,
      });

      // If no currentSubtrip was provided, clear the selected subtrip
      setSelectedSubtrip(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Get vehicle details from selected subtrip
  const vehicleType = selectedSubtrip?.tripId?.vehicleId?.vehicleType || '';
  const isOwn = selectedSubtrip?.tripId?.vehicleId?.isOwn || false;
  const trackingLink = selectedSubtrip?.tripId?.vehicleId?.trackingLink || '';

  return (
    <>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Info Section */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Iconify icon="mdi:truck-outline" sx={{ color: 'primary.main' }} />
            <Typography variant="h6">Basic Information</Typography>
          </Stack>

          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }}
            rowGap={3}
            columnGap={2}
          >
            {/* Subtrip Selection Button */}
            <Box>
              <Button
                fullWidth
                variant="outlined"
                onClick={subtripDialog.onTrue}
                disabled={!!currentSubtrip}
                sx={{
                  height: 56,
                  justifyContent: 'flex-start',
                  typography: 'body2',
                  borderColor: errors.subtripId?.message ? 'error.main' : 'text.disabled',
                }}
                startIcon={
                  <Iconify
                    icon={selectedSubtrip ? 'mdi:truck-fast' : 'mdi:truck-fast-outline'}
                    sx={{ color: selectedSubtrip ? 'primary.main' : 'text.disabled' }}
                  />
                }
              >
                {selectedSubtrip
                  ? `Subtrip #${selectedSubtrip._id || selectedSubtrip}`
                  : 'Select Subtrip *'}
              </Button>
            </Box>

            {selectedSubtrip && (
              <>
                <Field.Text
                  name="unloadingWeight"
                  label="Unloading Weight"
                  type="number"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {selectedSubtrip?.loadingWeight && (
                          <>
                            ≤ {selectedSubtrip.loadingWeight} {loadingWeightUnit[vehicleType]}
                          </>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Invoice No */}
                <Field.Text name="invoiceNo" label="Invoice No" type="text" required />

                {/* Rate */}
                <Field.Text
                  name="rate"
                  label="Freight Rate"
                  type="number"
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                  }}
                />

                {isOwn && (
                  <Box sx={{ position: 'relative' }}>
                    <Field.Text
                      name="endKm"
                      label="End Km"
                      type="number"
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {' '}
                            ≥ {selectedSubtrip?.startKm} Km
                          </InputAdornment>
                        ),
                      }}
                    />
                    {trackingLink && (
                      <Tooltip title="Track Vehicle">
                        <IconButton
                          size="small"
                          onClick={() => {
                            window.open(trackingLink, '_blank');
                          }}
                          sx={{
                            position: 'absolute',
                            right: 60,
                            top: 10,
                            color: 'primary.main',
                          }}
                        >
                          <Iconify icon="mdi:map-marker" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                )}

                {!isOwn && (
                  <>
                    <Field.Text
                      name="commissionRate"
                      label="Transporter Commission Rate"
                      type="number"
                      placeholder="0"
                      required
                      InputProps={{
                        endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                      }}
                    />

                    <Field.Text
                      name="effectiveRate"
                      label="Effective Rate"
                      type="number"
                      placeholder="0"
                      required
                      disabled
                      InputProps={{
                        endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                      }}
                    />
                  </>
                )}
              </>
            )}
          </Box>
        </Box>

        {/* Toggle Switches */}
        {selectedSubtrip && (
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={3}>
              <Field.Switch
                name="hasShortage"
                label="Has Shortage"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'warning.main',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'warning.main',
                  },
                }}
              />
              <Field.Switch
                name="hasError"
                label="Has Error"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'error.main',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'error.main',
                  },
                }}
              />
            </Stack>
          </Box>
        )}

        {/* Shortage Section */}
        {hasShortage && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Iconify icon="mdi:alert-circle-outline" sx={{ color: 'warning.main' }} />
                <Typography variant="h6">Shortage Information</Typography>
              </Stack>

              <Box
                display="grid"
                gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
                rowGap={3}
                columnGap={2}
              >
                <Field.Text
                  name="shortageWeight"
                  label="Shortage Weight"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Ton</InputAdornment>,
                  }}
                />

                <Field.Text
                  name="shortageAmount"
                  label="Shortage Amount"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                  }}
                />
              </Box>
            </Box>
          </>
        )}

        {/* Error Section */}
        {hasError && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Iconify icon="mdi:alert-octagon-outline" sx={{ color: 'error.main' }} />
                <Typography variant="h6">Error Information</Typography>
              </Stack>

              <Box display="grid" rowGap={3}>
                <Field.Text
                  name="errorRemarks"
                  label="Error Remarks"
                  type="text"
                  multiline
                  rows={3}
                />
              </Box>
            </Box>
          </>
        )}

        <Stack sx={{ mt: 2 }} direction="row" justifyContent="flex-end" spacing={2}>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => {
              reset({
                endKm: 0,
                startKm: 0,
                loadingWeight: 0,
                unloadingWeight: 0,
                commissionRate: 0,
                hasShortage: false,
                hasError: false,
                invoiceNo: '',
                rate: 0,
                effectiveRate: 0,
              });
              setSelectedSubtrip(null);
            }}
          >
            Reset
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </Button>
        </Stack>
      </Form>

      <KanbanSubtripDialog
        open={subtripDialog.value}
        onClose={subtripDialog.onFalse}
        selectedSubtrip={selectedSubtrip}
        onSubtripChange={handleSubtripChange}
        filterParams={{
          subtripStatus: [SUBTRIP_STATUS.LOADED],
        }}
      />
    </>
  );
}
