import { useDropzone } from 'react-dropzone';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { useBoolean } from 'src/hooks/use-boolean';

import { downloadFileFromUrl } from 'src/utils/download-file';

import { varAlpha } from 'src/theme/styles';
import { useUpdateSubtrip, getSubtripDocumentUploadUrl } from 'src/query/use-subtrip';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Lightbox, useLightBox } from 'src/components/lightbox';

// ---------------------------------------------------------------------------

const MAX_FILES = 5;
const MAX_SIZE_BYTES = 3145728; // 3 MB

function getFileIcon(url) {
  const ext = url?.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'solar:gallery-bold';
  if (ext === 'pdf') return 'solar:file-text-bold';
  return 'solar:file-bold';
}

function getFileLabel(url, index) {
  if (!url) return `Document ${index + 1}`;
  const cleanUrl = url.split('?')[0].split('#')[0];
  const rawFilename = cleanUrl.split('/').pop() || `Document ${index + 1}`;
  if (/^subtrip_/i.test(rawFilename) || /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(rawFilename)) {
    return `Document ${index + 1}`;
  }
  return rawFilename.length > 22 ? `${rawFilename.slice(0, 19)}...` : rawFilename;
}

function isImageUrl(url) {
  const ext = url?.split('?')[0].split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
}

// ---------------------------------------------------------------------------

function DocumentCard({ url, index, onDelete, onDownload, isDeleting, onOpenImage, publicMode }) {
  const confirm = useBoolean();

  const handleOpen = () => {
    if (!url) return;
    if (isImageUrl(url) && onOpenImage) {
      onOpenImage(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDelete = async () => {
    confirm.onFalse();
    await onDelete(url);
  };

  const isImg = isImageUrl(url);

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          position: 'relative',
          borderRadius: 1.5,
          overflow: 'hidden',
          height: 120,
          display: 'flex',
          flexDirection: 'column',
          border: (theme) => `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
          bgcolor: 'background.neutral',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: (theme) => theme.customShadows?.z8 || '0 8px 16px 0 rgba(0,0,0,0.1)',
            borderColor: 'primary.main',
          },
          '&:hover .doc-img': {
            transform: 'scale(1.08)',
          },
          '&:hover .doc-actions': {
            opacity: 1,
          },
        }}
      >
        {/* Thumbnail / Icon area */}
        <Box
          sx={{
            flex: '1 1 auto',
            minHeight: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {isImg ? (
            <Box
              component="img"
              className="doc-img"
              src={url}
              alt={`Document ${index + 1}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease-in-out',
              }}
            />
          ) : (
            <Iconify
              icon={getFileIcon(url)}
              width={36}
              sx={{
                color: url?.toLowerCase().includes('.pdf') ? 'error.main' : 'primary.main',
                opacity: 0.85,
              }}
            />
          )}
        </Box>

        {/* File info footer */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{
            flexShrink: 0,
            px: 1,
            py: 0.75,
            borderTop: (theme) =>
              `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'text.secondary',
            }}
          >
            {getFileLabel(url, index)}
          </Typography>
        </Stack>

        {/* Action buttons (Download & Delete) */}
        <Stack
          className="doc-actions"
          direction="row"
          spacing={0.5}
          sx={{
            position: 'absolute',
            top: 6,
            right: 6,
            opacity: 0,
            transition: 'opacity 0.2s',
            '@media (hover: none)': {
              opacity: 1,
            },
          }}
        >
          <Tooltip title="Download">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(url, index);
              }}
              sx={{
                width: 28,
                height: 28,
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                },
              }}
            >
              <Iconify icon="solar:download-minimalistic-bold" width={16} />
            </IconButton>
          </Tooltip>

          {!publicMode && (
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  confirm.onTrue();
                }}
                disabled={isDeleting}
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': {
                    bgcolor: 'error.lighter',
                    color: 'error.main',
                  },
                }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" width={16} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Box>

      {!publicMode && (
        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          title="Delete document"
          content="Are you sure you want to delete this document? This action cannot be undone."
          action={
            <Button variant="contained" color="error" onClick={handleDelete} disabled={isDeleting}>
              Delete
            </Button>
          }
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------

function UploadingDocumentCard({ fileName }) {
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 1.5,
        overflow: 'hidden',
        height: 120,
        display: 'flex',
        flexDirection: 'column',
        border: (theme) => `1px dashed ${varAlpha(theme.vars.palette.primary.mainChannel, 0.4)}`,
        bgcolor: (theme) => varAlpha(theme.vars.palette.primary.mainChannel, 0.04),
      }}
    >
      <Box
        sx={{
          flex: '1 1 auto',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
        }}
      >
        <CircularProgress size={22} thickness={4} color="primary" />
        <Typography
          variant="caption"
          sx={{ color: 'primary.main', fontWeight: 'fontWeightMedium', fontSize: 11 }}
        >
          Uploading...
        </Typography>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        sx={{
          flexShrink: 0,
          px: 1,
          py: 0.75,
          borderTop: (theme) =>
            `1px solid ${varAlpha(theme.vars.palette.primary.mainChannel, 0.12)}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'text.secondary',
          }}
        >
          {fileName}
        </Typography>
      </Stack>
    </Box>
  );
}

// ---------------------------------------------------------------------------

function AddMoreDropzone({ onDrop, onDropRejected, disabled }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    disabled,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: MAX_SIZE_BYTES,
    multiple: true,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        height: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.75,
        borderRadius: 1.5,
        border: (theme) =>
          `dashed 1px ${
            isDragActive
              ? theme.vars.palette.primary.main
              : varAlpha(theme.vars.palette.grey['500Channel'], 0.32)
          }`,
        bgcolor: (theme) =>
          isDragActive
            ? varAlpha(theme.vars.palette.primary.mainChannel, 0.08)
            : varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.48 : 1,
        transition: 'all 0.2s',
        '&:hover': disabled
          ? {}
          : {
              bgcolor: (theme) => varAlpha(theme.vars.palette.primary.mainChannel, 0.06),
              borderColor: 'primary.main',
            },
      }}
    >
      <input {...getInputProps()} />
      <Iconify
        icon="solar:cloud-upload-bold"
        width={28}
        sx={{
          color: isDragActive ? 'primary.main' : 'text.disabled',
          transform: isDragActive ? 'scale(1.15)' : 'none',
          transition: 'transform 0.2s',
        }}
      />
      <Typography variant="caption" color={isDragActive ? 'primary.main' : 'text.disabled'}>
        {isDragActive ? 'Drop here' : 'Add files'}
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------

function EmptyDropzone({ onDrop, onDropRejected, disabled }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    disabled,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: MAX_SIZE_BYTES,
    multiple: true,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        height: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.75,
        borderRadius: 1.5,
        border: (theme) =>
          `dashed 1.5px ${
            isDragActive
              ? theme.vars.palette.primary.main
              : varAlpha(theme.vars.palette.grey['500Channel'], 0.24)
          }`,
        bgcolor: (theme) =>
          isDragActive
            ? varAlpha(theme.vars.palette.primary.mainChannel, 0.06)
            : varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.48 : 1,
        transition: 'all 0.25s',
        '&:hover': disabled
          ? {}
          : {
              borderColor: 'primary.main',
              bgcolor: (theme) => varAlpha(theme.vars.palette.primary.mainChannel, 0.04),
            },
      }}
    >
      <input {...getInputProps()} />
      <Iconify
        icon="solar:cloud-upload-bold"
        width={32}
        sx={{
          color: isDragActive ? 'primary.main' : 'text.disabled',
          transform: isDragActive ? 'scale(1.15)' : 'none',
          transition: 'transform 0.2s',
        }}
      />
      <Typography
        variant="caption"
        sx={{ color: isDragActive ? 'primary.main' : 'text.secondary', fontWeight: 'fontWeightMedium' }}
      >
        {isDragActive ? 'Drop files here' : 'Drop or select documents'}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 10 }}>
        Images & PDFs, max 3 MB each
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------

export function SubtripDocumentsWidget({ subtrip, publicMode = false, sx }) {
  const { _id, docs: savedDocs = [], subtripNo } = subtrip || {};
  const updateSubtrip = useUpdateSubtrip();

  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const savedUrls = useMemo(
    () => (Array.isArray(savedDocs) ? savedDocs.filter(Boolean) : []),
    [savedDocs]
  );

  const isUploading = uploadingFiles.length > 0;
  const canAddMore = !publicMode && savedUrls.length + uploadingFiles.length < MAX_FILES;

  // Image slides for Lightbox
  const imageSlides = useMemo(
    () => savedUrls.filter(isImageUrl).map((url) => ({ src: url })),
    [savedUrls]
  );
  const lightbox = useLightBox(imageSlides);

  const handleDownload = useCallback(
    (url, index) => {
      const filename = `${subtripNo || 'subtrip'}_document_${index + 1}`;
      downloadFileFromUrl(url, filename);
    },
    [subtripNo]
  );

  const handleDropRejected = useCallback((fileRejections) => {
    fileRejections.forEach((rejection) => {
      const { file, errors } = rejection;
      const errorMsg = errors
        .map((e) => {
          if (e.code === 'file-too-large') return `"${file.name}" exceeds the 3 MB limit`;
          if (e.code === 'file-invalid-type') return `"${file.name}" is not an image or PDF`;
          return e.message;
        })
        .join(', ');
      toast.error(errorMsg);
    });
  }, []);

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles?.length) return;

      const remaining = MAX_FILES - savedUrls.length;
      if (remaining <= 0) {
        toast.error(`Maximum of ${MAX_FILES} documents reached`);
        return;
      }

      const filesToUpload = acceptedFiles.slice(0, remaining);
      if (acceptedFiles.length > remaining) {
        toast.error(`Only ${remaining} file(s) can be added (max ${MAX_FILES})`);
      }

      try {
        setUploadingFiles(filesToUpload.map((f) => f.name));

        const uploadedUrls = await Promise.all(
          filesToUpload.map(async (file) => {
            const fileExtension = file.name.split('.').pop() || 'pdf';
            const contentType = file.type || 'application/pdf';
            const resUrl = await getSubtripDocumentUploadUrl({ contentType, fileExtension });
            const res = await fetch(resUrl.uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': contentType },
              body: file,
            });
            if (!res.ok) throw new Error('Upload failed');
            return resUrl.publicUrl;
          })
        );

        const newDocs = [...savedUrls, ...uploadedUrls];
        await new Promise((resolve, reject) => {
          updateSubtrip(
            { id: _id, data: { docs: newDocs } },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });
      } catch (err) {
        console.error({ err }, 'Failed to upload documents');
        toast.error('Failed to upload documents');
      } finally {
        setUploadingFiles([]);
      }
    },
    [_id, savedUrls, updateSubtrip]
  );

  const handleDeleteSaved = useCallback(
    async (url) => {
      try {
        setIsDeleting(true);
        const newDocs = savedUrls.filter((u) => u !== url);
        await new Promise((resolve, reject) => {
          updateSubtrip(
            { id: _id, data: { docs: newDocs } },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });
      } catch (err) {
        console.error({ err }, 'Failed to delete document');
        toast.error('Failed to delete document');
      } finally {
        setIsDeleting(false);
      }
    },
    [_id, savedUrls, updateSubtrip]
  );

  const hasDocs = savedUrls.length > 0 || uploadingFiles.length > 0;

  return (
    <>
      <Card sx={{ mt: 3, ...sx }}>
        <CardHeader
          title="Documents"
          avatar={<Iconify icon="solar:document-bold" color="primary.main" width={24} />}
          sx={{
            '& .MuiCardHeader-avatar': { mr: 1 },
            '& .MuiCardHeader-title': { fontWeight: 'fontWeightBold' },
          }}
          action={
            <Chip
              label={`${savedUrls.length} / ${MAX_FILES}`}
              size="small"
              variant="soft"
              color={savedUrls.length >= MAX_FILES ? 'error' : 'default'}
            />
          }
        />

        {isUploading && <LinearProgress color="primary" sx={{ mx: 3 }} />}

        <Box sx={{ p: 2.5, minHeight: 150 }}>
          {!hasDocs ? (
            publicMode ? (
              <Box
                sx={{
                  py: 4,
                  textAlign: 'center',
                  color: 'text.secondary',
                  typography: 'body2',
                }}
              >
                No documents uploaded
              </Box>
            ) : (
              <EmptyDropzone
                onDrop={handleDrop}
                onDropRejected={handleDropRejected}
                disabled={isUploading}
              />
            )
          ) : (
            <Grid container spacing={1.5}>
              {/* Saved document cards */}
              {savedUrls.map((url, index) => (
                <Grid key={url} item xs={6}>
                  <DocumentCard
                    url={url}
                    index={index}
                    onDelete={handleDeleteSaved}
                    onDownload={handleDownload}
                    isDeleting={isDeleting}
                    publicMode={publicMode}
                    onOpenImage={(imgUrl) => lightbox.onOpen(imgUrl)}
                  />
                </Grid>
              ))}

              {/* In-grid uploading placeholder cards */}
              {uploadingFiles.map((name, idx) => (
                <Grid key={name + idx} item xs={6}>
                  <UploadingDocumentCard fileName={name} />
                </Grid>
              ))}

              {/* Add more dropzone tile */}
              {canAddMore && (
                <Grid item xs={6}>
                  <AddMoreDropzone
                    onDrop={handleDrop}
                    onDropRejected={handleDropRejected}
                    disabled={isUploading || !canAddMore}
                  />
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </Card>

      {/* Full-screen Lightbox for image documents */}
      <Lightbox
        index={lightbox.selected}
        slides={imageSlides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}

export default SubtripDocumentsWidget;
