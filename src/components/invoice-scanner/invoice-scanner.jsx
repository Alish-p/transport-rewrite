import { createWorker } from 'tesseract.js';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from '../iconify';

export default function InvoiceScanner({ open, onClose, onScanComplete }) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start camera capture
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setIsCapturing(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      streamRef.current = stream;
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
      setIsCapturing(false);
      console.error('Camera access error:', err);
    }
  }, []);

  // Stop camera capture
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCapturing(false);
  }, []);

  // Capture image from video stream
  const captureImage = useCallback(() => {
    if (!videoRef.current) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg');
  }, []);

  // Process image with Tesseract OCR
  const processImage = useCallback(
    async (imageData) => {
      try {
        setIsProcessing(true);
        setError(null);

        const worker = await createWorker('eng');

        const {
          data: { text },
        } = await worker.recognize(imageData);

        await worker.terminate();

        // Extract invoice data using regex patterns
        const invoiceData = extractInvoiceData(text);

        onScanComplete(invoiceData);
        onClose();
      } catch (err) {
        setError('Failed to process image. Please try again.');
        console.error('OCR processing error:', err);
      } finally {
        setIsProcessing(false);
      }
    },
    [onScanComplete, onClose]
  );

  // Extract invoice data from OCR text
  const extractInvoiceData = (text) => {
    // Initialize default data
    const data = {
      invoiceNo: '',
      orderNo: '',
      shipmentNo: '',
      consignee: '',
      loadingWeight: 0,
      rate: 0,
    };

    // Extract invoice number (common patterns: "Invoice No:", "INV-", etc.)
    const invoiceMatch = text.match(/(?:Invoice\s*(?:No|Number|#)?:?\s*)([A-Z0-9-]+)/i);
    if (invoiceMatch && invoiceMatch[1]) {
      data.invoiceNo = invoiceMatch[1].trim();
    }

    // Extract order number
    const orderMatch = text.match(/(?:Order\s*(?:No|Number|#)?:?\s*)([A-Z0-9-]+)/i);
    if (orderMatch && orderMatch[1]) {
      data.orderNo = orderMatch[1].trim();
    }

    // Extract shipment number
    const shipmentMatch = text.match(/(?:Shipment\s*(?:No|Number|#)?:?\s*)([A-Z0-9-]+)/i);
    if (shipmentMatch && shipmentMatch[1]) {
      data.shipmentNo = shipmentMatch[1].trim();
    }

    // Extract consignee (usually after "Consignee:" or "Bill To:")
    const consigneeMatch = text.match(/(?:Consignee|Bill\s*To):\s*([^\n]+)/i);
    if (consigneeMatch && consigneeMatch[1]) {
      data.consignee = consigneeMatch[1].trim();
    }

    // Extract loading weight (usually in kg or tons)
    const weightMatch = text.match(
      /(?:Weight|Loading\s*Weight):\s*(\d+(?:\.\d+)?)\s*(?:kg|tons?)/i
    );
    if (weightMatch && weightMatch[1]) {
      data.loadingWeight = parseFloat(weightMatch[1]);
    }

    // Extract rate (usually in currency format)
    const rateMatch = text.match(/(?:Rate|Price):\s*([₹$]?\s*\d+(?:,\d+)*(?:\.\d+)?)/i);
    if (rateMatch && rateMatch[1]) {
      data.rate = parseFloat(rateMatch[1].replace(/[₹$,]/g, ''));
    }

    return data;
  };

  // Handle capture button click
  const handleCapture = useCallback(() => {
    const imageData = captureImage();
    if (imageData) {
      stopCamera();
      processImage(imageData);
    }
  }, [captureImage, stopCamera, processImage]);

  // Clean up on dialog close
  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Scan Invoice</Typography>
          <IconButton onClick={handleClose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ position: 'relative', width: '100%', height: 300, mb: 2 }}>
          {!isCapturing ? (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.neutral',
                borderRadius: 1,
                cursor: 'pointer',
              }}
              onClick={startCamera}
            >
              <Stack spacing={1} alignItems="center">
                <Iconify icon="mdi:camera" width={48} />
                <Typography variant="body2">Click to start camera</Typography>
              </Stack>
            </Box>
          ) : (
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <track kind="captions" src="" label="English" />
              </video>

              {isProcessing && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </Box>
          )}
        </Box>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary">
          Position the invoice within the camera frame and tap the capture button to scan.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>

        {isCapturing && !isProcessing && (
          <Button
            variant="contained"
            onClick={handleCapture}
            startIcon={<Iconify icon="mdi:camera" />}
          >
            Capture
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
