import { z as zod } from 'zod';
import { useMemo, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { today } from 'src/utils/format-time';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useUpdateSubtripReceiveInfo } from '../../query/use-subtrip';
// form components

const validationSchema = zod
  .object({
    remarks: zod.string().optional(),
    loadingWeight: zod
      .number({ required_error: 'Loading weight is required' })
      .positive({ message: 'Loading weight must be a positive number' }),
    unloadingWeight: zod.number({ required_error: 'Unloading weight is required' }),
    deductedWeight: zod
      .number({ required_error: 'Deducted weight is required' })
      .min(0, { message: 'Deducted weight cannot be negative' }),
    deductedAmount: zod.number().min(0, { message: 'Deducted weight cannot be negative' }),
    startKm: zod
      .number({ required_error: 'Start Km is required' })
      .positive({ message: 'Start Km must be a positive number' }),
    endKm: zod.number({ required_error: 'End Km is required' }),
    totalKm: zod
      .number()
      .min(0, { message: 'Total Km must be zero or a positive number' })
      .optional(),
    endDate: schemaHelper.date({ message: { required_error: 'End date is required!' } }),
    commissionRate: zod
      .number()
      .min(0, { message: 'Commission rate cannot be negative' })
      .optional(),
    hasError: zod.boolean(),
  })
  .superRefine((values, ctx) => {
    // Validate unloadingWeight <= loadingWeight
    if (values.unloadingWeight > values.loadingWeight) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'Unloading weight must be less than or equal to loading weight',
        path: ['unloadingWeight'],
      });
    }

    // Validate endKm >= startKm
    if (values.endKm < values.startKm) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'End Km must be greater than or equal to Start Km',
        path: ['endKm'],
      });
    }
  });

// ---------------------------------------------------------------

export function RecieveSubtripDialog({ showDialog, setShowDialog, subtrip }) {
  const receiveSubtrip = useUpdateSubtripReceiveInfo();
  const { _id, loadingWeight, startKm, tripId } = subtrip;

  const defaultValues = useMemo(
    () => ({
      remarks: '',
      loadingWeight: loadingWeight || 0,
      unloadingWeight: 0,
      deductedWeight: 0,
      deductedAmount: 0,
      startKm: startKm || 0,
      endKm: 0,
      totalKm: 0,
      endDate: today(),
      commissionRate: 0,
      hasError: false,
    }),
    [loadingWeight, startKm]
  );

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
    control,
  } = methods;

  // Add effect to update form values when subtrip changes
  useEffect(() => {
    if (subtrip) {
      reset({
        ...defaultValues,
        loadingWeight: subtrip.loadingWeight || 0,
        startKm: subtrip.startKm || 0,
      });
    }
  }, [subtrip, reset, defaultValues]);

  const unloadingWeight = useWatch({ control, name: 'unloadingWeight' });
  const endKm = useWatch({ control, name: 'endKm' });
  const commissionRate = useWatch({ control, name: 'commissionRate' });

  useEffect(() => {
    const deductedWeight = loadingWeight - unloadingWeight;
    setValue('deductedWeight', deductedWeight);

    const totalKm = endKm - startKm;
    setValue('totalKm', totalKm);
  }, [unloadingWeight, loadingWeight, setValue, endKm, startKm, commissionRate]);

  const handleReset = () => {
    reset(defaultValues);
  };

  const onSubmit = async (data) => {
    try {
      await receiveSubtrip({ id: _id, data });
      handleReset();
      setShowDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!showDialog) {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDialog]);

  return (
    <Dialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      fullWidth
      maxWidth={false}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <DialogTitle>Receive Subtrip</DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: '6px' }}>
          <Form methods={methods} onSubmit={onSubmit}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <Field.Text name="loadingWeight" label="Loading Wt." type="number" disabled />
              <Field.Text name="unloadingWeight" label="Unloading Wt." type="number" autoFocus />
              <Field.Text
                name="deductedWeight"
                label="Deducted Weight"
                type="number"
                disabled
                placeholder="0"
              />

              <Field.Text name="startKm" label="Start Km" type="number" disabled />
              <Field.Text name="endKm" label="End Km" type="number" />
              <Field.Text name="totalKm" label="Total Trip Km" type="number" disabled />
              <Field.Text
                name="deductedAmount"
                label="Deducted Amount"
                type="number"
                disabled={loadingWeight === unloadingWeight}
              />

              <Field.DatePicker name="endDate" label="End Date" />

              <Field.Text name="remarks" label="Remarks" type="text" />

              {!tripId?.vehicleId?.isOwn && (
                <Field.Text
                  name="commissionRate"
                  label="Transporter Commission Rate"
                  type="number"
                  placeholder="0"
                />
              )}
            </Box>

            <Box sx={{ marginTop: '20px' }}>
              <Field.Switch
                name="hasError"
                label={<Typography variant="subtitle2">Recieved With Error?</Typography>}
              />
            </Box>
          </Form>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button type="reset" onClick={handleReset} variant="outlined" loading={isSubmitting}>
          Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
