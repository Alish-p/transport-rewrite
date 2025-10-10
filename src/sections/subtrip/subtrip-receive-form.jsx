import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
  Typography,
  LinearProgress,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useSubtrip, useUpdateSubtripReceiveInfo } from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { SUBTRIP_STATUS } from './constants';
import { receiveSchema } from './subtrip-schemas';
import { loadingWeightUnit } from '../vehicle/vehicle-config';
import { BasicExpenseTable } from './widgets/basic-expense-table';
import { SubtripDetailCard } from './widgets/subtrip-detail-card';
import { KanbanSubtripDialog } from '../kanban/components/kanban-subtrip-dialog';

const defaultValues = {
  subtripId: '',
  endDate: new Date(),
  unloadingWeight: 0,
  commissionRate: 0,
  hasShortage: false,
  hasError: false,
  shortageWeight: 0,
  shortageAmount: 0,
  remarks: '',
};

const ReceiveFormFields = ({ selectedSubtrip, methods, errors, subtripDialog, isLoading }) => {
  const { watch } = methods;
  const { hasError, hasShortage, unloadingWeight, commissionRate } = watch();
  const { isOwn, vehicleType } = selectedSubtrip?.vehicleId || {};

  return (
    <Card sx={{ p: 2, height: '100%' }}>
      {isLoading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
          <LinearProgress color="info" size={24} sx={{ mt: 1 }} />
        </Box>
      )}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Iconify icon="mdi:truck-outline" sx={{ color: 'primary.main' }} />
        <Typography variant="h6">Job Receive Details</Typography>
      </Stack>

      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
        <DialogSelectButton
          onClick={subtripDialog.onTrue}
          placeholder="Select Job *"
          selected={selectedSubtrip?.subtripNo}
          error={!!errors.subtripId?.message}
          iconName="mdi:truck-fast"
          sx={{ gridColumn: '1 / -1' }}
        />

        {selectedSubtrip && (
          <>
            <Field.Text
              name="unloadingWeight"
              label="Unloading Weight"
              type="number"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{loadingWeightUnit[vehicleType]}</InputAdornment>
                ),
              }}
            />

            {isOwn ? null : (
              <Field.Text
                name="commissionRate"
                label="Transporter Commission Rate"
                type="number"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Iconify icon="mdi:currency-inr" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <Field.DatePicker name="endDate" label="LR Receive Date *" />
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
                <Field.Number
                  name="shortageWeight"
                  label="Shortage Weight"
                  helperText=""
                  placeholder="0"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {loadingWeightUnit[vehicleType]}
                      </InputAdornment>
                    ),
                  }}
                />
                <Field.Text
                  name="shortageAmount"
                  label="Shortage Amount"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Iconify icon="mdi:currency-inr" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Box>
          )}

          {hasError && (
            <Box>
              <Typography variant="subtitle2" color="error.main" gutterBottom>
                Error Details
              </Typography>
              <Field.Text name="remarks" label="Error Remarks" type="text" multiline rows={3} />
            </Box>
          )}
        </>
      )}

      <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
        {unloadingWeight > selectedSubtrip?.loadingWeight && (
          <Alert severity="error" variant="outlined">
            Unloading weight cannot be more than loading weight
          </Alert>
        )}
        {commissionRate > selectedSubtrip?.rate && (
          <Alert severity="error" variant="outlined">
            Commission rate cannot be more than the freight rate
          </Alert>
        )}
      </Stack>
    </Card>
  );
};

export function SubtripReceiveForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSubtripId = searchParams.get('currentSubtrip');
  const redirectTo = searchParams.get('redirectTo');

  const subtripDialog = useBoolean();
  const [selectedSubtripId, setSelectedSubtripId] = useState(() => currentSubtripId || null);

  const { data: selectedSubtripData, isLoading: isLoadingSelectedSubtrip } =
    useSubtrip(selectedSubtripId);

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

  const { unloadingWeight, commissionRate } = watch();
  const { isOwn } = selectedSubtripData?.vehicleId || {};
  const handleSubtripChange = useCallback(
    (subtrip) => {
      setSelectedSubtripId(subtrip._id);

      reset({
        ...defaultValues,
        subtripId: subtrip._id,
      });
    },
    [reset]
  );

  const onSubmit = async (data) => {
    try {
      console.log('form data', data);
      await receiveSubtrip({ id: selectedSubtripData._id, data });
      reset(defaultValues);
      setSelectedSubtripId(null);
      if (redirectTo) navigate(redirectTo);
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  // effects to fetch data
  useEffect(() => {
    if (currentSubtripId) {
      handleSubtripChange({ _id: currentSubtripId });
    }
  }, [currentSubtripId, handleSubtripChange]);

  // Removed endKm auto-fill via GPS as endKm is no longer captured

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
                onClick={() => {
                  reset(defaultValues);
                  setSelectedSubtripId(null);
                }}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={
                  !isValid ||
                  isSubmitting ||
                  // local errors
                  unloadingWeight > selectedSubtripData?.loadingWeight ||
                  (!isOwn && commissionRate > selectedSubtripData?.rate)
                }
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
                  commissionRate={watch('commissionRate')}
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
