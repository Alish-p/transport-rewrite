import { useRef, useState, useEffect } from 'react';

import { Box, Card, Link, Typography, CircularProgress } from '@mui/material';

import axios from 'src/utils/axios';

import { getMediaProxyUrl } from 'src/query/use-whatsapp';

// ----------------------------------------------------------------------

export function WhatsAppMessageImage({ mediaId, caption, onImageClick }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const blobUrlRef = useRef(null);

  useEffect(() => {
    if (!mediaId) {
      setLoading(false);
      setError(true);
      return undefined;
    }

    let cancelled = false;

    const fetchImage = async () => {
      try {
        const url = getMediaProxyUrl(mediaId);
        const response = await axios.get(url, { responseType: 'blob' });
        if (cancelled) return;
        const objectUrl = URL.createObjectURL(response.data);
        blobUrlRef.current = objectUrl;
        setBlobUrl(objectUrl);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      cancelled = true;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, [mediaId]);

  if (loading) {
    return (
      <Box sx={{ width: 200, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error || !blobUrl) {
    return (
      <Card variant="outlined" sx={{ p: 2, maxWidth: 320, bgcolor: 'background.neutral' }}>
        <Typography variant="body2" color="error" gutterBottom>
          Unable to load image
        </Typography>
        {mediaId && (
          <Link href={getMediaProxyUrl(mediaId)} target="_blank" rel="noopener" variant="caption">
            Try opening in new tab
          </Link>
        )}
      </Card>
    );
  }

  return (
    <Box>
      <Box
        component="img"
        src={blobUrl}
        alt={caption || 'WhatsApp Image'}
        onClick={() => onImageClick?.(blobUrl)}
        sx={{
          maxWidth: 320,
          maxHeight: 280,
          objectFit: 'cover',
          borderRadius: 1,
          cursor: 'pointer',
          display: 'block',
        }}
      />
      {caption && (
        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
          {caption}
        </Typography>
      )}
    </Box>
  );
}
