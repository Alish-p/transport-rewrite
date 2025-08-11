import { useState, useEffect, useCallback } from 'react';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { DashboardContent } from 'src/layouts/dashboard';
import { useUpdateInvoiceStatus } from 'src/query/use-invoice';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import InvoiceView from '../invoice-view';
import InvoiceToolbar from '../invoice-toolbar';

// Available invoice status options
const INVOICE_STATUS_OPTIONS = [
  { value: 'Received', label: 'Received' },
  { value: 'Partial Received', label: 'Partially Paid' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Overdue', label: 'Overdue' },
  { value: 'Cancelled', label: 'Cancelled' },
];

// Main component to display invoice details and allow status update
export function InvoiceDetailView({ invoice }) {
  const updateInvoice = useUpdateInvoiceStatus();

  const { invoiceStatus = '', _id, invoiceNo } = invoice;

  const [statusValue, setStatusValue] = useState(invoiceStatus);
  const [partialAmount, setPartialAmount] = useState('');
  const [openPartial, setOpenPartial] = useState(false);
  const [prevStatus, setPrevStatus] = useState(invoiceStatus);

  useEffect(() => {
    setStatusValue(invoiceStatus);
  }, [invoiceStatus]);

  const handleChangeStatus = useCallback(
    (event) => {
      const newStatus = event.target.value;
      setStatusValue(newStatus);
      if (newStatus === 'Partial Received') {
        setPrevStatus(invoiceStatus);
        setOpenPartial(true);
      } else {
        updateInvoice({ id: _id, status: newStatus });
      }
    },
    [updateInvoice, _id, invoiceStatus]
  );

  const handleCancelPartial = () => {
    setStatusValue(prevStatus);
    setPartialAmount('');
    setOpenPartial(false);
  };

  const handleConfirmPartial = () => {
    updateInvoice({ id: _id, status: 'Partial Received', amount: Number(partialAmount) });
    setPartialAmount('');
    setOpenPartial(false);
  };

  return (
    <DashboardContent>
      {/* Breadcrumb navigation */}
      <CustomBreadcrumbs
        heading={invoiceNo}
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Invoice', href: '/dashboard/invoice' },
          { name: invoiceNo },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* Toolbar for status update and action buttons */}
      <InvoiceToolbar
        invoice={invoice}
        currentStatus={statusValue}
        onChangeStatus={handleChangeStatus}
        statusOptions={INVOICE_STATUS_OPTIONS}
      />

      {/* Invoice display content */}
      <InvoiceView invoice={invoice} />

      <Dialog open={openPartial} onClose={handleCancelPartial} fullWidth maxWidth="xs">
        <DialogTitle>Enter amount paid</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={partialAmount}
            onChange={(e) => setPartialAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelPartial}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmPartial} disabled={!partialAmount}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
