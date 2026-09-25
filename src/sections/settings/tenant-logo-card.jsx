import { toast } from 'sonner';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useQueryClient } from '@tanstack/react-query';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Divider, CardHeader, Typography, CircularProgress } from '@mui/material';

import { getTenantLogoUrl, getTenantSignatureUrl } from 'src/utils/tenant-branding';

import { varAlpha } from 'src/theme/styles';
import {
  saveTenantLogo,
  saveTenantSignature,
  getTenantLogoUploadUrl,
  getTenantSignatureUploadUrl,
} from 'src/query/use-tenant';

import { Iconify } from 'src/components/iconify';
import { UploadAvatar } from 'src/components/upload';

import { useAuthContext } from 'src/auth/hooks';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];

function getExtension(file) {
  const fromName = file?.name?.split('.')?.pop()?.toLowerCase();
  if (fromName) return fromName;
  // fallback from content-type
  if (!file?.type) return '';
  const map = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };
  return map[file.type] || '';
}

export default function TenantLogoCard({ tenant }) {
  const queryClient = useQueryClient();
  const { checkUserSession } = useAuthContext();

  // Logo state
  const [isLogoUploading, setLogoUploading] = useState(false);
  const [isLogoSaving, setLogoSaving] = useState(false);
  const [localLogoFile, setLocalLogoFile] = useState(null);

  // Signature state
  const [isSigUploading, setSigUploading] = useState(false);
  const [isSigSaving, setSigSaving] = useState(false);
  const [localSigFile, setLocalSigFile] = useState(null);

  const hasRealLogo = Boolean(tenant?.logoUrl);
  const currentLogoUrl = getTenantLogoUrl(tenant, { fallback: false });

  const hasRealSignature = Boolean(tenant?.signatureUrl);
  const currentSignatureUrl = localSigFile
    ? URL.createObjectURL(localSigFile)
    : getTenantSignatureUrl(tenant);

  // ---------------- Logo Handlers ----------------
  const doUploadLogo = async (file) => {
    try {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error('Invalid file type. Allowed: PNG, JPG, WEBP, SVG');
        return;
      }
      const extension = getExtension(file);
      if (!extension) {
        toast.error('Could not detect file extension');
        return;
      }

      setLogoUploading(true);
      const { key, uploadUrl } = await getTenantLogoUploadUrl({
        contentType: file.type,
        extension,
      });

      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!res.ok) {
        throw new Error('Upload failed');
      }

      setLogoSaving(true);
      const updatedTenant = await saveTenantLogo({ fileKey: key });

      queryClient.setQueryData(['tenant'], updatedTenant);
      queryClient.invalidateQueries(['tenant']);
      checkUserSession?.();
      toast.success('Logo updated');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Logo upload failed');
    } finally {
      setLogoUploading(false);
      setLogoSaving(false);
    }
  };

  const handleLogoDrop = async (acceptedFiles) => {
    const file = acceptedFiles?.[0];
    if (!file) return;
    setLocalLogoFile(file);
    await doUploadLogo(file);
    setLocalLogoFile(null);
  };

  const handleLogoRemove = async () => {
    try {
      setLogoSaving(true);
      const updatedTenant = await saveTenantLogo({ fileKey: null });
      queryClient.setQueryData(['tenant'], updatedTenant);
      queryClient.invalidateQueries(['tenant']);
      checkUserSession?.();
      toast.success('Logo removed');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Failed to remove logo');
    } finally {
      setLogoSaving(false);
    }
  };

  // ---------------- Signature Handlers ----------------
  const doUploadSignature = async (file) => {
    try {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error('Invalid file type. Allowed: PNG, JPG, WEBP, SVG');
        return;
      }
      const extension = getExtension(file);
      if (!extension) {
        toast.error('Could not detect file extension');
        return;
      }

      setSigUploading(true);
      const { key, uploadUrl } = await getTenantSignatureUploadUrl({
        contentType: file.type,
        extension,
      });

      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!res.ok) {
        throw new Error('Upload failed');
      }

      setSigSaving(true);
      const updatedTenant = await saveTenantSignature({ fileKey: key });

      queryClient.setQueryData(['tenant'], updatedTenant);
      queryClient.invalidateQueries(['tenant']);
      checkUserSession?.();
      toast.success('Authorized signature updated');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Signature upload failed');
    } finally {
      setSigUploading(false);
      setSigSaving(false);
    }
  };

  const handleSignatureDrop = async (acceptedFiles) => {
    const file = acceptedFiles?.[0];
    if (!file) return;
    setLocalSigFile(file);
    await doUploadSignature(file);
    setLocalSigFile(null);
  };

  const handleSignatureRemove = async () => {
    try {
      setSigSaving(true);
      const updatedTenant = await saveTenantSignature({ fileKey: null });
      queryClient.setQueryData(['tenant'], updatedTenant);
      queryClient.invalidateQueries(['tenant']);
      checkUserSession?.();
      toast.success('Authorized signature removed');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Failed to remove signature');
    } finally {
      setSigSaving(false);
    }
  };

  const isSigBusy = isSigUploading || isSigSaving;
  const isLogoBusy = isLogoUploading || isLogoSaving;

  const {
    getRootProps: getSigRootProps,
    getInputProps: getSigInputProps,
    isDragActive: isSigDragActive,
    isDragReject: isSigDragReject,
  } = useDropzone({
    onDrop: handleSignatureDrop,
    disabled: isSigBusy,
    accept: {
      'image/png': [],
      'image/jpeg': [],
      'image/webp': [],
      'image/svg+xml': [],
    },
    maxFiles: 1,
  });

  return (
    <Card>
      <CardHeader
        title="Branding & Signatures"
        subheader="Manage your company logo and authorized signatory for lorry receipts and official documents"
        sx={{ mb: 1 }}
      />
      <Divider />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />}
        sx={{ p: 3 }}
      >
        {/* Company Logo Section */}
        <Stack spacing={1.5} alignItems={{ xs: 'center', md: 'flex-start' }} sx={{ flex: 1 }}>
          <Typography variant="subtitle2">Company Logo</Typography>

          <Box sx={{ position: 'relative' }}>
            <UploadAvatar
              value={localLogoFile || (hasRealLogo ? currentLogoUrl : null)}
              onDrop={handleLogoDrop}
              disabled={isLogoBusy}
              accept={{
                'image/png': [],
                'image/jpeg': [],
                'image/webp': [],
                'image/svg+xml': [],
              }}
              fallback={
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {(tenant?.name?.trim?.()?.[0] || '?').toUpperCase()}
                </Typography>
              }
              sx={{ width: 124, height: 124 }}
            />

            {isLogoBusy && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255,255,255,0.6)',
                  borderRadius: '50%',
                }}
              >
                <CircularProgress size={28} thickness={5} />
              </Box>
            )}
          </Box>

          <Typography variant="caption" sx={{ color: 'text.disabled', textAlign: { xs: 'center', md: 'left' } }}>
            Allowed *.jpeg, *.jpg, *.png, *.svg
          </Typography>

          {hasRealLogo && (
            <LoadingButton
              color="error"
              variant="soft"
              size="small"
              onClick={handleLogoRemove}
              loading={isLogoSaving}
            >
              Remove Logo
            </LoadingButton>
          )}
        </Stack>

        {/* Authorized Signature Section */}
        <Stack spacing={1.5} alignItems={{ xs: 'center', md: 'flex-start' }} sx={{ flex: 1 }}>
          <Typography variant="subtitle2">Authorized Signatory / Stamp</Typography>

          <Box sx={{ position: 'relative', width: 240 }}>
            <Box
              {...getSigRootProps()}
              sx={{
                width: 240,
                height: 124,
                borderRadius: 1.5,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 1.5,
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.06),
                border: (theme) =>
                  `dashed 1px ${varAlpha(
                    isSigDragReject
                      ? theme.vars.palette.error.mainChannel
                      : theme.vars.palette.grey['500Channel'],
                    isSigDragReject ? 1 : 0.24
                  )}`,
                ...(isSigDragActive && { opacity: 0.72 }),
                ...(isSigBusy && { opacity: 0.48, pointerEvents: 'none' }),
                '&:hover': {
                  opacity: 0.8,
                  borderColor: 'primary.main',
                },
              }}
            >
              <input {...getSigInputProps()} />

              {currentSignatureUrl ? (
                <Box
                  component="img"
                  src={currentSignatureUrl}
                  alt="Authorized Signatory"
                  sx={{
                    maxWidth: 1,
                    maxHeight: 1,
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <Stack spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
                  <Iconify icon="mdi:signature-freehand" width={32} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Upload Signature / Stamp
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 10 }}>
                    Click or drag & drop image
                  </Typography>
                </Stack>
              )}
            </Box>

            {isSigBusy && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255,255,255,0.6)',
                  borderRadius: 1.5,
                }}
              >
                <CircularProgress size={28} thickness={5} />
              </Box>
            )}
          </Box>

          <Typography variant="caption" sx={{ color: 'text.disabled', textAlign: { xs: 'center', md: 'left' } }}>
            Recommended: PNG with transparent background
          </Typography>

          {hasRealSignature && (
            <LoadingButton
              color="error"
              variant="soft"
              size="small"
              onClick={handleSignatureRemove}
              loading={isSigSaving}
            >
              Remove Signature
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
