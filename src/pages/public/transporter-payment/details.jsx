import { useCallback, useEffect, useRef, useState } from 'react';
import { pdf } from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { usePublicTransporterPayment } from 'src/query/use-transporter-payment';

import TransporterPaymentPdf from 'src/pdfs/transporter-payment-pdf';
import { Iconify } from 'src/components/iconify';

export default function PublicTransporterPaymentDetailsPage() {
  const { id } = useParams();

  const { data: transporterPayment } = usePublicTransporterPayment(id);

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const hasRunRef = useRef(false);

  const handleDownload = useCallback(async () => {
    if (!transporterPayment) return;
    setGenerating(true);
    setError(null);
    try {
      const doc = (
        <TransporterPaymentPdf transporterPayment={transporterPayment} tenant={CONFIG.company} />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileBase = transporterPayment?.paymentId || id || 'transporter_payment';
      a.download = `${fileBase}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to download transporter payment PDF', e);
      setError('Failed to generate the PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  }, [id, transporterPayment]);

  useEffect(() => {
    if (!transporterPayment || hasRunRef.current) return;
    hasRunRef.current = true;
    handleDownload();
  }, [handleDownload, transporterPayment]);

  return (
    <Box sx={{ px: 3, py: 8, minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center', maxWidth: 520 }}>
        <Iconify icon="fa:file-pdf-o" width={56} sx={{ color: 'error.main' }} />
        <Typography variant="h5">
          Preparing transporter payment PDF
          {transporterPayment?.paymentId ? ` — ${transporterPayment.paymentId}` : ''}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Your download should start automatically. If it doesn’t, use the button below.
          You can close this tab after the file downloads.
        </Typography>
        {generating ? <CircularProgress /> : null}
        {error && (
          <Typography variant="caption" sx={{ color: 'error.main' }}>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:download-fill" />}
          disabled={!transporterPayment || generating}
          onClick={handleDownload}
        >
          {generating ? 'Generating…' : 'Download now'}
        </Button>
      </Stack>
    </Box>
  );
}
