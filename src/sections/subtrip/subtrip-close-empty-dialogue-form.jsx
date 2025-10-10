import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';

import { useCloseEmptySubtrip } from 'src/query/use-subtrip';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

const CloseEmptySubtripSchema = zod.object({
  endDate: schemaHelper.date({ message: { required_error: 'End date is required!' } }),
  endKm: zod.number().min(0, 'End kilometer must be greater than or equal to start kilometer'),
});

export function SubtripCloseEmptyDialog({ showDialog, setShowDialog, subtripId }) {
  const closeEmptySubtrip = useCloseEmptySubtrip();

  const methods = useForm({
    resolver: zodResolver(CloseEmptySubtripSchema),
    defaultValues: {
      endDate: new Date(),
      endKm: 0,
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await closeEmptySubtrip({
        id: subtripId,
        data,
      });
      setShowDialog(false);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={showDialog} onClose={() => setShowDialog(false)}>
      <DialogTitle>Close Empty Job</DialogTitle>

      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
            <Field.DatePicker name="endDate" label="End Date" />
            <Field.Text
              name="endKm"
              label="End Kilometer"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">km</InputAdornment>,
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            Close Job
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
