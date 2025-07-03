import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
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

// form components
import { Form, Field } from 'src/components/hook-form';

import { useUpdateSubtripCloseInfo } from '../../query/use-subtrip';

const validationSchema = zod.object({
  userConfirm: zod.boolean().refine((val) => val === true, {
    message: 'You must confirm before closing',
  }),
});

const defaultValues = {
  userConfirm: false,
};

export function SubtripCloseDialog({ showDialog, setShowDialog, subtripId }) {
  const closeSubtrip = useUpdateSubtripCloseInfo();

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = methods;

  const handleReset = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  const onSubmit = async () => {
    try {
      await closeSubtrip(subtripId);
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
      <DialogTitle> Close Subtrip </DialogTitle>
      <DialogContent>
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
