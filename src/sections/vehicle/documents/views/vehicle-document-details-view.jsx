import { useNavigate } from 'react-router';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import axios from 'src/utils/axios';
import { fDateTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { usePaginatedDocuments, useDeleteVehicleDocument } from 'src/query/use-documents';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { getStatusMeta, getExpiryStatus } from '../../utils/document-utils';
import { DocumentHistoryChatList } from '../components/document-history-chat-list';

export function VehicleDocumentDetailsView({ doc }) {
  const navigate = useNavigate();
  const confirmDelete = useBoolean();
  const [deleting, setDeleting] = useState(false);
  const del = useDeleteVehicleDocument();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingUrl, setLoadingUrl] = useState(false);

  const vehicleId = useMemo(() => {
    const raw = doc?.vehicleId || doc?.vehicle?._id || doc?.vehicle?.id || doc?.vehicle;
    if (!raw) return null;
    if (typeof raw === 'string') return raw;
    return raw?._id || raw?.id || null;
  }, [doc]);

  useEffect(() => {
    let active = true;
    const loadUrl = async () => {
      if (!doc?._id || !vehicleId) {
        setPreviewUrl(doc?.fileUrl || null);
        return;
      }
      try {
        setLoadingUrl(true);
        const { data } = await axios.get(`/api/documents/${vehicleId}/${doc._id}/download`);
        if (!active) return;
        setPreviewUrl(data?.url || doc?.fileUrl || null);
      } catch (e) {
        if (!active) return;
        setPreviewUrl(doc?.fileUrl || null);
      } finally {
        if (active) setLoadingUrl(false);
      }
    };
    loadUrl();
    return () => {
      active = false;
    };
  }, [doc?._id, doc?.fileUrl, vehicleId]);

  const status = getExpiryStatus(doc?.expiryDate);
  const statusMeta = status ? getStatusMeta(status) : null;

  // History (inactive documents of same type for this vehicle)
  const [histPage, setHistPage] = useState(1);
  const rowsPerPage = 10;

  const {
    data: historyResp,
    isLoading: historyLoading,
    isFetching: historyFetching,
  } = usePaginatedDocuments(
    vehicleId && doc?.docType
      ? {
          vehicleId,
          docType: doc?.docType,
          page: histPage,
          rowsPerPage,
          isActive: false, // fetch inactive only
        }
      : undefined,
    {
      enabled: !!vehicleId && !!doc?.docType,
      keepPreviousData: true,
    }
  );

  const historyList = historyResp?.results || [];
  const historyTotal = historyResp?.total || 0;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await del({ vehicleId, docId: doc?._id });
      confirmDelete.onFalse();
      navigate(paths.dashboard.vehicle.documents);
    } catch (e) {
      // handled by hook toast
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Vehicle Document Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Documents List', href: paths.dashboard.vehicle.documents },
          { name: doc?.docType || 'Document Details' },
        ]}
        action={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="eva:edit-2-outline" />}
              onClick={() => navigate(paths.dashboard.vehicle.editDocument(doc._id))}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={confirmDelete.onTrue}
              disabled={deleting}
            >
              Delete
            </Button>
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        {/* Left Column: Preview */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
            <CardHeader title="Document Attachment" sx={{ width: '100%', px: 0, pt: 0, mb: 3 }} />
            {loadingUrl ? (
              <CircularProgress />
            ) : previewUrl ? (
              <FileThumbnail
                imageView
                tooltip
                onDownload={handleDownload}
                file={previewUrl}
                sx={{ width: '100%', height: 'auto', maxHeight: 400, alignSelf: 'center' }}
                slotProps={{
                  img: { width: '100%', height: 'auto', maxHeight: 400, objectFit: 'contain' },
                  icon: { width: 96, height: 96 },
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No file attached
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Right Column: Properties */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <CardHeader title="Properties" sx={{ px: 0, pt: 0, mb: 3 }} />
            <Stack spacing={2}>
              <PropRow label="Vehicle" value={doc?.vehicle?.vehicleNo || doc?.vehicleNo || '-'} />
              <Divider />
              <PropRow label="Type" value={doc?.docType || '-'} />
              <Divider />
              <PropRow label="Number" value={doc?.docNumber || '-'} />
              <Divider />
              <PropRow label="Issuer" value={doc?.issuer || '-'} />
              <Divider />
              <PropRow label="Issue Date" value={doc?.issueDate ? fDateTime(doc.issueDate) : '-'} />
              <Divider />
              <PropRow label="Expiry Date" value={doc?.expiryDate ? fDateTime(doc.expiryDate) : '-'} />
              <Divider />
              <PropRow
                label="Status"
                value={
                  statusMeta ? (
                    <Label color={statusMeta.color} startIcon={<Iconify icon={statusMeta.icon} />}>
                      {status}
                    </Label>
                  ) : (
                    '-'
                  )
                }
              />
              <Divider />
              <PropRow
                label="Created By"
                value={doc?.createdBy?.name || doc?.createdByName || '-'}
              />
              <Divider />
              <PropRow
                label="Active Status"
                value={
                  <Label color={doc?.isActive ? 'success' : 'error'} variant="soft">
                    {doc?.isActive ? 'Active' : 'Inactive'}
                  </Label>
                }
              />
            </Stack>
          </Card>
        </Grid>

        {/* Bottom Section: History */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <CardHeader title="Version History" sx={{ px: 0, pt: 0, mb: 3 }} />
            
            {historyLoading && (
              <Stack alignItems="center" sx={{ py: 3 }}>
                <CircularProgress size={24} />
              </Stack>
            )}

            {!historyLoading && historyList.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No history available.
              </Typography>
            )}

            {!historyLoading && historyList.length > 0 && (
              <>
                <DocumentHistoryChatList vehicleId={vehicleId} items={historyList} />
                {historyTotal > rowsPerPage && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    justifyContent="center"
                    sx={{ mt: 2 }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={histPage <= 1 || historyFetching}
                      onClick={() => setHistPage((p) => Math.max(1, p - 1))}
                    >
                      Prev
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                      Page {histPage} of {Math.max(1, Math.ceil(historyTotal / rowsPerPage))}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={
                        histPage >= Math.ceil(historyTotal / rowsPerPage) || historyFetching
                      }
                      onClick={() => setHistPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </Stack>
                )}
              </>
            )}
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete document?"
        content={`This will remove ${doc?.docType || 'document'} record. File on storage is not deleted.`}
        action={
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting}>
            {deleting ? <CircularProgress size={18} /> : 'Delete'}
          </Button>
        }
      />
    </DashboardContent>
  );
}

function PropRow({ label, value }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ typography: 'body2' }}>
      <Box component="span" sx={{ width: 120, color: 'text.secondary', fontWeight: 'fontWeightMedium', flexShrink: 0 }}>
        {label}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        {typeof value === 'string' || typeof value === 'number' ? (
          <Typography variant="body2">{value}</Typography>
        ) : (
          value
        )}
      </Box>
    </Stack>
  );
}
