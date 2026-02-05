import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { useCreateTyre } from 'src/query/use-tyre';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const TYPE_OPTIONS = [
    { value: 'New', label: 'New' },
    { value: 'Remolded', label: 'Remolded' },
    { value: 'Used', label: 'Used' },
];

export const TyreSchema = zod.object({
    brand: zod.string().min(1, { message: 'Brand is required' }),
    model: zod.string().min(1, { message: 'Model is required' }),
    serialNumber: zod.string().min(1, { message: 'Tyre Number is required' }),
    size: zod.string().min(1, { message: 'Size is required' }),
    type: zod.string().min(1, { message: 'Type is required' }),
    purchaseOrderNumber: zod.string().optional(),
    totalMileage: zod.coerce.number().min(0, { message: 'Kilometers must be >= 0' }),
    cost: zod.coerce.number().min(0, { message: 'Cost must be >= 0' }),
    threadDepth: zod.object({
        original: zod.coerce.number().min(1, { message: 'Original thread depth must be > 0' }),
        current: zod.coerce.number().min(0, { message: 'Current thread depth must be >= 0' }),
    }),
    metadata: zod.object({
        isRemoldable: zod.boolean().optional(),
    }).optional(),
});

export default function TyreNewEditForm() {
    const navigate = useNavigate();
    const createTyre = useCreateTyre();

    const defaultValues = useMemo(
        () => ({
            brand: '',
            model: '',
            serialNumber: '',
            size: '',
            type: 'New',
            purchaseOrderNumber: '',
            totalMileage: 0,
            cost: 0,
            threadDepth: {
                original: 0,
                current: 0,
            },
            metadata: {
                isRemoldable: true,
            }
        }),
        []
    );

    const methods = useForm({
        resolver: zodResolver(TyreSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = methods;

    const type = watch('type');

    // "if type new = openingkm will be 0 disabled"
    useMemo(() => {
        if (type === 'New') {
            setValue('totalMileage', 0);
        }
    }, [type, setValue]);

    const originalThreadDepth = watch('threadDepth.original');

    // If type is New, current thread depth equals original
    useMemo(() => {
        if (type === 'New') {
            setValue('threadDepth.current', originalThreadDepth);
        }
    }, [type, originalThreadDepth, setValue]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                threadDepth: {
                    ...data.threadDepth,
                    lastMeasuredDate: new Date().toISOString(),
                }
            };
            await createTyre.mutateAsync(payload);
            reset();
            toast('Tyre created successfully!');
            navigate(paths.dashboard.tyre.list);
        } catch (error) {
            console.error(error);
            toast(error?.message || 'Create success!', { variant: 'error' });
        }
    };

    const renderDetails = (
        <Card>
            <CardHeader title="Tyre Details" sx={{ mb: 3 }} />
            <Divider />
            <Stack spacing={3} sx={{ p: 3 }}>
                <Field.Text name="brand" label="Brand" placeholder="e.g. Michelin" />
                <Field.Text name="model" label="Model" placeholder="e.g. X Multi T" />
                <Field.Text name="serialNumber" label="Tyre Number / Serial" placeholder="e.g. TYRE-990123" />
                <Field.Text name="size" label="Size" placeholder="e.g. 295/80R22.5" />
            </Stack>
        </Card>
    );

    const renderProperties = (
        <Card>
            <CardHeader title="Properties & Cost" sx={{ mb: 3 }} />
            <Divider />
            <Stack spacing={3} sx={{ p: 3 }}>
                <Field.Select name="type" label="Type">
                    {TYPE_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Field.Select>

                <Field.Text
                    name="totalMileage"
                    label="Opening KM"
                    type="number"
                    disabled={type === 'New'}
                    InputLabelProps={{ shrink: true }}
                />

                <Field.Text
                    name="purchaseOrderNumber"
                    label="Purchase Order Number"
                    placeholder="Optional"
                />

                <Field.Text
                    name="cost"
                    label="Cost"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    placeholder="0.00"
                />

                <Stack direction="row" spacing={2}>
                    <Field.Text
                        name="threadDepth.original"
                        label="Original Thread Depth (mm)"
                        type="number"
                        InputLabelProps={{ shrink: true }}
                    />
                    <Field.Text
                        name="threadDepth.current"
                        label="Current Thread Depth (mm)"
                        type="number"
                        disabled={type === 'New'}
                        InputLabelProps={{ shrink: true }}
                    />
                </Stack>
            </Stack>
        </Card>
    );

    const renderActions = (
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Create Tyre
            </LoadingButton>
        </Stack>
    );

    return (
        <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
                {renderDetails}
                {renderProperties}
                {renderActions}
            </Stack>
        </Form>
    );
}
