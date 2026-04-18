import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TyreSellDialog({ open, onClose, onSell }) {

    const SellTyreSchema = z.object({
        sellDate: z.date(),
        sellAmount: z.coerce.number().min(0, 'Amount must be 0 or greater'),
    });

    const methods = useForm({
        resolver: zodResolver(SellTyreSchema),
        defaultValues: {
            sellDate: new Date(),
            sellAmount: 1000,
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        await onSell(data);
        onClose();
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Sell Scrapped Tyre</DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Field.DatePicker
                        name="sellDate"
                        label="Sell Date"
                        sx={{ mt: 2, width: '100%' }}
                    />
                    <Field.Text
                        name="sellAmount"
                        label="Selling Amount (INR)"
                        type="number"
                        sx={{ mt: 2 }}
                        helperText="Enter the amount for which tyre was sold"
                    />
                </Form>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    color="primary"
                    loading={isSubmitting}
                >
                    Sell
                </Button>
            </DialogActions>
        </Dialog>
    );
}
