/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
// routes

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import InvoicePDF from 'src/pdfs/invoice-pdf';
import { usePayInvoice, useCancelInvoice } from 'src/query/use-invoice';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { useTenantContext } from 'src/auth/tenant';

// ----------------------------------------------------------------------

export default function InvoiceToolbar({ invoice, currentStatus }) {
  const router = useRouter();

  const view = useBoolean();
  const confirmCancel = useBoolean();
  const payDialog = useBoolean();

  const tenant = useTenantContext();

  const cancelInvoice = useCancelInvoice();
  const payInvoice = usePayInvoice();

  const [amount, setAmount] = useState(0);
  const remainingAmount = Math.max(0, (invoice?.netTotal || 0) - (invoice?.totalReceived || 0));

  const handleEdit = useCallback(() => {
    router.push(paths.dashboard.invoice.edit(invoice?._id));
  }, [invoice._id, router]);

  const handleCancelInvoice = useCallback(async () => {
    try {
      await cancelInvoice(invoice?._id);
      confirmCancel.onFalse();
    } catch (error) {
      console.error(error);
    }
  }, [cancelInvoice, confirmCancel, invoice._id]);

  const handleOpenPay = useCallback(() => {
    setAmount(remainingAmount);
    payDialog.onTrue();
  }, [remainingAmount, payDialog]);

  const handleChangeAmount = (event) => {
    setAmount(Number(event.target.value));
  };

  const handlePayInvoice = useCallback(async () => {
    try {
      await payInvoice({ id: invoice?._id, amount });
      payDialog.onFalse();
    } catch (error) {
      console.error(error);
    }
  }, [amount, invoice._id, payDialog, payInvoice]);

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Stack direction="row" spacing={1} flexGrow={1} sx={{ width: 1 }}>
          <Tooltip title="Edit">
            <IconButton onClick={handleEdit}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="View">
            <IconButton onClick={view.onTrue}>
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>

          <PDFDownloadLink
            document={
              <InvoicePDF invoice={invoice} currentStatus={currentStatus} tenant={tenant} />
            }
            fileName={invoice._id}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Tooltip title="Download">
                <IconButton>
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <Iconify icon="eva:cloud-download-fill" />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </PDFDownloadLink>

          <Tooltip title="Print">
            <IconButton>
              <Iconify icon="solar:printer-minimalistic-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Send">
            <IconButton>
              <Iconify icon="iconamoon:send-fill" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton>
              <Iconify icon="solar:share-bold" />
            </IconButton>
          </Tooltip>

          {remainingAmount > 0 && currentStatus !== 'Cancelled' && (
            <Tooltip title="Record payment">
              <IconButton color="success" onClick={handleOpenPay}>
                <Iconify icon="ant-design:dollar-circle-filled" />
              </IconButton>
            </Tooltip>
          )}

          {currentStatus !== 'Cancelled' && (
            <Tooltip title="Cancel invoice">
              <IconButton color="error" onClick={confirmCancel.onTrue}>
                <Iconify icon="material-symbols:cancel-outline" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      <Dialog fullScreen open={view.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <InvoicePDF invoice={invoice} currentStatus={currentStatus} tenant={tenant} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={confirmCancel.value}
        onClose={confirmCancel.onFalse}
        title="Cancel invoice"
        content="Are you sure you want to cancel this invoice? All linked subtrips will be available for billing."
        action={
          <Button variant="contained" color="error" onClick={handleCancelInvoice}>
            Cancel invoice
          </Button>
        }
      />

      <ConfirmDialog
        open={payDialog.value}
        onClose={payDialog.onFalse}
        title="Record payment"
        content={
          <TextField
            autoFocus
            fullWidth
            type="number"
            label="Amount"
            value={amount}
            onChange={handleChangeAmount}
            inputProps={{ min: 0, max: remainingAmount }}
            error={amount <= 0 || amount > remainingAmount}
            helperText={
              amount <= 0
                ? 'Amount must be greater than 0'
                : amount > remainingAmount
                  ? 'Amount exceeds pending amount'
                  : ''
            }
          />
        }
        action={
          <Button
            variant="contained"
            onClick={handlePayInvoice}
            disabled={amount <= 0 || amount > remainingAmount}
          >
            Pay
          </Button>
        }
      />
    </>
  );
}
