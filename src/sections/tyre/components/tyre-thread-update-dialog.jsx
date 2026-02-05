import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useUpdateTyreThread } from 'src/query/use-tyre';

export default function TyreThreadUpdateDialog({ open, onClose, tyreId, currentDepth }) {
    const updateThread = useUpdateTyreThread();

    const UpdateThreadSchema = zod.object({
        current: zod.coerce.number().min(0, { message: 'Must be positive' }),
        measuringDate: schemaHelper.date({ message: { required_error: 'Measuring date is required' } }),
    });

    const defaultValues = {
        current: currentDepth || 0,
        measuringDate: new Date(),
    };

    const methods = useForm({
        resolver: zodResolver(UpdateThreadSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data) => {
        try {
            await updateThread.mutateAsync({
                id: tyreId,
                data: {
                    current: data.current,
                    measuringDate: data.measuringDate
                },
            });
            reset();
            onClose();
            toast('Thread depth updated successfully!');
        } catch (error) {
            console.error(error);
            toast(error.message || 'Unable to update thread depth', { variant: 'error' });
        }
    };

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <DialogTitle>Update Thread Depth</DialogTitle>

            <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 1 }}>
                        <Field.Text name="current" label="Current Thread Depth (mm)" type="number" />
                        <Field.DatePicker name="measuringDate" label="Measuring Date" />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Update
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
