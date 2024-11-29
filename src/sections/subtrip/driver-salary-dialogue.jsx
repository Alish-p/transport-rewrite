import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  List,
  Stack,
  Button,
  Dialog,
  ListItem,
  DialogTitle,
  ListItemText,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { closeTrip } from 'src/redux/slices/subtrip';

import { toast } from 'src/components/snackbar';
// form components
import { Form, Field } from 'src/components/hook-form';

const validationSchema = zod.object({
  userConfirm: zod.boolean().refine((val) => val === true, {
    message: 'You must confirm before closing',
  }),
});

const defaultValues = {
  userConfirm: false,
};

export function DriverSalaryDialogue({ showDialog, setShowDialog, subtrip }) {
  const dispatch = useDispatch();

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
    watch,
  } = methods;

  const handleReset = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  console.log({ subtrip });

  const onSubmit = async (data) => {
    try {
      // Dispatch action to update subtrip with material details
      await dispatch(closeTrip(subtrip));
      toast.success('Subtrip Closed Successfully !');
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
  }, [showDialog, handleReset]);

  return (
    <Dialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      fullWidth
      maxWidth={false}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <DialogTitle> Driver Salary </DialogTitle>
      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <List sx={{ listStyle: 'decimal', pl: 4 }}>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="The Fixed Salary For the route is - " />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="The Percentage Salary for the route is -" />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="Performance Salary for this route is 0" />
            </ListItem>
          </List>

          <Box mt={3} rowGap={3} columnGap={2} display="grid">
            <Field.Checkbox name="userConfirm" label="I confirm" />
          </Box>
        </Form>
      </DialogContent>

      <DialogActions>
        <Stack direction="row" spacing={1}>
          <Button
            type="reset"
            onClick={() => setShowDialog(false)}
            variant="outlined"
            loading={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!watch('userConfirm')}
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            Close
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
