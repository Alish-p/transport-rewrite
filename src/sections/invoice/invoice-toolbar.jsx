/* eslint-disable react/prop-types */
import { useCallback } from 'react';
import { pdf, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

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

import { copyToClipboard } from 'src/utils/copy-to-clipboard';

import InvoicePDF from 'src/pdfs/invoice-pdf';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useTenantContext } from 'src/auth/tenant';

// ----------------------------------------------------------------------

export default function InvoiceToolbar({ invoice, currentStatus, statusOptions, onChangeStatus }) {
  const router = useRouter();

  const view = useBoolean();

  const tenant = useTenantContext();

  const handleEdit = useCallback(() => {
    router.push(paths.dashboard.invoice.edit(invoice?._id));
  }, [invoice._id, router]);

  const handlePrint = useCallback(async () => {
    const blob = await pdf(
      <InvoicePDF invoice={invoice} currentStatus={currentStatus} tenant={tenant} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  }, [invoice, currentStatus, tenant]);

  const handleSend = useCallback(() => {
    const link = `${window.location.origin}${paths.dashboard.invoice.details(invoice?._id)}`;
    const subject = encodeURIComponent(`Invoice ${invoice?._id}`);
    const body = encodeURIComponent(`Please view the invoice at ${link}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [invoice._id]);

  const handleShare = useCallback(async () => {
    const link = `${window.location.origin}${paths.dashboard.invoice.details(invoice?._id)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Invoice ${invoice?._id}`, url: link });
      } catch {
        copyToClipboard(link);
        toast.success('Link copied to clipboard');
      }
    } else {
      copyToClipboard(link);
      toast.success('Link copied to clipboard');
    }
  }, [invoice._id]);

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
            <IconButton onClick={handlePrint}>
              <Iconify icon="solar:printer-minimalistic-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Send">
            <IconButton onClick={handleSend}>
              <Iconify icon="iconamoon:send-fill" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton onClick={handleShare}>
              <Iconify icon="solar:share-bold" />
            </IconButton>
          </Tooltip>
        </Stack>

        <TextField
          fullWidth
          select
          label="Status"
          value={currentStatus}
          onChange={onChangeStatus}
          sx={{
            maxWidth: 160,
          }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
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
    </>
  );
}
