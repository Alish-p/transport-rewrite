import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
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

import { receiveLR } from 'src/redux/slices/subtrip';

import { toast } from 'src/components/snackbar';

import { today } from '../../utils/format-time';
import { Form, Field, schemaHelper } from '../../components/hook-form';
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
    startKm: zod
      .number({ required_error: 'Start Km is required' })
      .positive({ message: 'Start Km must be a positive number' }),
    endKm: zod.number({ required_error: 'End Km is required' }),
    totalKm: zod
      .number()
      .min(0, { message: 'Total Km must be zero or a positive number' })
      .optional(),
    endDate: schemaHelper.date({ message: { required_error: 'End date is required!' } }),

    detentionTime: zod
      .number({ required_error: 'Detention time is required' })
      .min(0, { message: 'Detention time must be zero or a positive number' }),
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
  const dispatch = useDispatch();

  const { _id, loadingWeight, startKm } = subtrip;

  const defaultValues = {
    remarks: '',
    loadingWeight,
    unloadingWeight: 0,
    deductedWeight: 0,
    startKm,
    endKm: 0,
    totalKm: 0,
    endDate: today(),
    detentionTime: 0,
    hasError: false,
  };

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

  const unloadingWeight = useWatch({ control, name: 'unloadingWeight' });
  const endKm = useWatch({ control, name: 'endKm' });

  useEffect(() => {
    const deductedWeight = loadingWeight - unloadingWeight;
    setValue('deductedWeight', deductedWeight);
    setValue('hasError', deductedWeight !== 0);

    const totalKm = endKm - startKm;
    setValue('totalKm', totalKm);
  }, [unloadingWeight, loadingWeight, setValue, endKm, startKm]);

  const handleReset = () => {
    reset(defaultValues);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(receiveLR(_id, data));
      toast.success('Subtrip received successfully!');
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
                showZero
              />

              <Field.Text name="startKm" label="Start Km" type="number" disabled />
              <Field.Text name="endKm" label="End Km" type="number" />
              <Field.Text name="totalKm" label="Total Trip Km" type="number" disabled />

              <Field.DatePicker name="endDate" label="End Date" />

              <Field.Text name="detentionTime" label="Detention Time" type="number" />
              <Field.Text name="remarks" label="Remarks" type="text" />
            </Box>

            <Box sx={{ marginTop: '20px' }}>
              <Field.Switch
                name="hasError"
                label={<Typography variant="subtitle2">Recievied With Error ?</Typography>}
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
