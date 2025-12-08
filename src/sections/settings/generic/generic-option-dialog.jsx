import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useCreateOption, useUpdateOption } from 'src/query/use-options';

import { Form, Field } from 'src/components/hook-form';

const GenericOptionSchema = zod.object({
    label: zod.string().min(1, { message: 'Name is required' }),
});

export function GenericOptionDialog({ open, onClose, currentOption, group, title }) {
    const createOption = useCreateOption();
    const updateOption = useUpdateOption();

    const defaultValues = useMemo(
        () => ({
            label: currentOption?.label || currentOption?.value || '',
        }),
        [currentOption]
    );

    const methods = useForm({
        resolver: zodResolver(GenericOptionSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (currentOption) {
            reset(defaultValues);
        } else {
            reset({ label: '' });
        }
    }, [currentOption, defaultValues, reset]);

    const onSubmit = async (data) => {
        const payload = {
            group,
            label: data.label.trim(),
            value: data.label.trim(),
        };

        try {
            if (currentOption?._id) {
                await updateOption({ id: currentOption._id, data: payload });
            } else {
                await createOption(payload);
            }
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <DialogTitle>
                {currentOption ? `Edit ${title}` : `Add ${title}`}
            </DialogTitle>

            <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                        <Field.Text name="label" label="Name" />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        {currentOption ? 'Save Changes' : 'Create'}
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
