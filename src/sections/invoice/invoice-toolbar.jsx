/* eslint-disable react/prop-types */
import { useCallback } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
// routes

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import InvoicePDF from 'src/pdfs/invoice-pdf';
import { useCancelInvoice } from 'src/query/use-invoice';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { useTenantContext } from 'src/auth/tenant';

import { INVOICE_STATUS } from './invoice-config';
import InvoicePaymentDialog from './invoice-payment-dialog';
import InvoicePaymentTimeline from './invoice-payment-timeline';

// ----------------------------------------------------------------------

export default function InvoiceToolbar({ invoice, currentStatus }) {
  const router = useRouter();

  const view = useBoolean();
  const confirmCancel = useBoolean();
  const payDialog = useBoolean();
  const historyPopover = usePopover();

  const tenant = useTenantContext();

  const cancelInvoice = useCancelInvoice();
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
    payDialog.onTrue();
  }, [payDialog]);

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        sx={{ mb: { xs: 2 } }}
      >
        <Stack direction="row" spacing={1} flexGrow={1} sx={{ width: 1 }}>
          <Tooltip title="Edit">
            <IconButton onClick={handleEdit}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          {currentStatus !== INVOICE_STATUS.CANCELLED && (
            <Tooltip title="Cancel invoice">
              <IconButton onClick={confirmCancel.onTrue}>
                <Iconify icon="material-symbols:cancel-outline" />
              </IconButton>
            </Tooltip>
          )}

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
          <Tooltip title="Payment history">
            <IconButton onClick={historyPopover.onOpen}>
              <Iconify icon="mdi:timeline-clock-outline" />
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />

          {remainingAmount > 0 && currentStatus !== INVOICE_STATUS.CANCELLED && (
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mdi:cash-check" />}
              onClick={handleOpenPay}
            >
              Mark as Paid
            </Button>
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

      <CustomPopover
        open={historyPopover.open}
        anchorEl={historyPopover.anchorEl}
        onClose={historyPopover.onClose}
        slotProps={{ paper: { sx: { p: 0, width: 320 } }, arrow: { placement: 'left-top' } }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2">Payment history</Typography>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Box sx={{ p: 2 }}>
          <InvoicePaymentTimeline payments={invoice?.payments} />
        </Box>
      </CustomPopover>

      <ConfirmDialog
        open={confirmCancel.value}
        onClose={confirmCancel.onFalse}
        title="Cancel invoice"
        content="Are you sure you want to cancel this invoice? All linked jobs will be available for billing."
        action={
          <Button variant="contained" color="error" onClick={handleCancelInvoice}>
            Cancel invoice
          </Button>
        }
      />

      <InvoicePaymentDialog open={payDialog.value} onClose={payDialog.onFalse} invoice={invoice} />
    </>
  );
}
