import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTenantPayments } from 'src/query/use-tenant-admin';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';

const PaymentSchema = zod.object({
  amount: zod
    .coerce
    .number({ invalid_type_error: 'Amount must be a number' })
    .min(0, { message: 'Amount must be non-negative' }),
  paymentDate: zod.preprocess((v) => (v ? new Date(v) : v), zod.date({ invalid_type_error: 'Invalid date' })),
  paymentMethod: zod.enum(['UPI', 'Card', 'BankTransfer', 'Cash']),
  status: zod.enum(['SUCCESS', 'FAILED', 'PENDING']).optional(),
  notes: zod.string().optional(),
});

export function PaymentFormDialog({ open, onClose, onSubmit, initial }) {
  const defaultValues = useMemo(
    () => ({
      amount: initial?.amount ?? 0,
      paymentDate: initial?.paymentDate ? new Date(initial.paymentDate) : new Date(),
      paymentMethod: initial?.paymentMethod ?? 'BankTransfer',
      status: initial?.status ?? 'PENDING',
      notes: initial?.notes ?? '',
    }),
    [initial]
  );

  const methods = useForm({
    resolver: zodResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const submit = handleSubmit((data) => {
    const payload = {
      ...data,
      // Ensure number
      amount: Number(data.amount),
      paymentDate: new Date(data.paymentDate).toISOString(),
    };
    onSubmit(payload);
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? 'Edit Payment' : 'Add Payment'}</DialogTitle>
      <Form methods={methods} onSubmit={submit}>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Field.Text
              name="amount"
              label="Amount"
              type="number"
              inputProps={{ step: '0.01', min: 0 }}
            />
            <Field.DatePicker name="paymentDate" label="Payment Date" />
            <Field.Select native name="paymentMethod" label="Method">
              <option value="BankTransfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
            </Field.Select>
            <Field.Select native name="status" label="Status">
              <option value="PENDING">PENDING</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
            </Field.Select>
            <Field.Text name="notes" label="Notes" multiline rows={3} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

export function TenantAdminPayments({ tenant, onTenantUpdated }) {
  const { addPayment, updatePayment, deletePayment } = useTenantPayments();

  const [formOpen, setFormOpen] = useState(false);
  const [editPayment, setEditPayment] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, payment: null });

  const handleAdd = () => {
    setEditPayment(null);
    setFormOpen(true);
  };

  const handleEdit = (payment) => {
    setEditPayment(payment);
    setFormOpen(true);
  };

  const handleDelete = (payment) => setConfirm({ open: true, payment });

  const closeConfirm = () => setConfirm({ open: false, payment: null });

  const handleSubmit = async (values) => {
    if (editPayment?._id) {
      const updated = await updatePayment({
        tenantId: tenant._id,
        paymentId: editPayment._id,
        patch: values,
      });
      onTenantUpdated?.(updated);
    } else {
      const updated = await addPayment({ tenantId: tenant._id, payment: values });
      onTenantUpdated?.(updated);
    }
    setFormOpen(false);
  };

  const confirmDelete = async () => {
    const updated = await deletePayment({
      tenantId: tenant._id,
      paymentId: confirm.payment._id,
    });
    onTenantUpdated?.(updated);
    closeConfirm();
  };

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <h3 style={{ margin: 0 }}>Payment History</h3>
        <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />} onClick={handleAdd}>
          Add Payment
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(tenant?.paymentHistory || []).map((row, idx) => (
              <TableRow key={row._id || idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{fCurrency(row.amount)}</TableCell>
                <TableCell>{fDate(row.paymentDate)}</TableCell>
                <TableCell>{row.paymentMethod}</TableCell>
                <TableCell>{row.status || '-'}</TableCell>
                <TableCell>{row.notes || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(row)}>
                    <Iconify icon="solar:pen-bold" />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(row)}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PaymentFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={editPayment}
      />

      <ConfirmDialog
        open={confirm.open}
        onClose={closeConfirm}
        title="Delete Payment?"
        content="This will remove the payment record."
        action={
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
