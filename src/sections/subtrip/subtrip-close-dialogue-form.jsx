import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, List, Stack, Button, ListItem, ListItemText } from '@mui/material';

import { closeTrip } from 'src/redux/slices/subtrip';

import { toast } from 'src/components/snackbar';
// form components
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';

const validationSchema = zod.object({
  userConfirm: zod.boolean().refine((val) => val === true, {
    message: 'You must confirm before closing',
  }),
});

const defaultValues = {
  userConfirm: false,
};

export function SubtripCloseDialog({ showDialog, setShowDialog, subtripId }) {
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

  const onSubmit = async (data) => {
    try {
      // Dispatch action to update subtrip with material details
      await dispatch(closeTrip(subtripId));
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
    <ConfirmDialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      title="Close Subtrip"
      content={
        <Box>
          <Form methods={methods} onSubmit={onSubmit}>
            <List sx={{ listStyle: 'decimal', pl: 4 }}>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary="Please confirm that you have added all the related information and expenses to the sub-trip." />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary="The signed LR is received without any errors." />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary="You will not be able to edit this LR once it is closed." />
              </ListItem>
            </List>

            <Box mt={3} rowGap={3} columnGap={2} display="grid">
              <Field.Checkbox name="userConfirm" label="I confirm" />
            </Box>
          </Form>
        </Box>
      }
      action={
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
      }
    />
  );
}
