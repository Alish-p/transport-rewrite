// ---------------------------------------------------------------
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

import { Form, Field } from '../../components/hook-form';
// form components

const validationSchema = zod.object({
  remarks: zod.string().optional(),
  unloadingWeight: zod
    .number({ required_error: 'Unloading weight is required' })
    .refine((val, ctx) => val <= ctx.parent.loadingWeight, {
      message: 'Unloading weight must be less than or equal to loading weight',
      path: ['unloadingWeight'], // This tells Zod which field to point to in case of error
    }),
  endKm: zod
    .number({ required_error: 'End Km is required' })
    .refine((val, ctx) => val >= ctx.parent.startKm, {
      message: 'End Km must be greater than Start Km',
      path: ['endKm'], // This tells Zod which field to point to in case of error
    }),
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
    endDate: null,
    detentionTime: 0,
    hasError: false,
  };

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
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
