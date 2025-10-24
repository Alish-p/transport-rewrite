import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { useBoolean } from 'src/hooks/use-boolean';

import axios from 'src/utils/axios';
import { fDateTime } from 'src/utils/format-time';

import { usePaginatedDocuments, useDeleteVehicleDocument } from 'src/query/use-documents';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';

import VehicleDocumentFormDialog from 'src/sections/vehicle/documents/components/vehicle-document-form-dialog';

import { getStatusMeta, getExpiryStatus } from '../utils/document-utils';
import { DocumentHistoryChatList } from './components/document-history-chat-list';

export function DocumentDetailsDrawer({ open, onClose, doc }) {
  const [tab, setTab] = useState('overview');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingUrl, setLoadingUrl] = useState(false);
  const confirmDelete = useBoolean();
  const [deleting, setDeleting] = useState(false);
  const del = useDeleteVehicleDocument();
  const [editOpen, setEditOpen] = useState(false);

  const vehicleId = useMemo(() => doc?.vehicle?._id || doc?.vehicleId || doc?.vehicle, [doc]);

  useEffect(() => {
    setTab('overview');
  }, [open]);

  useEffect(() => {
    let active = true;
    const loadUrl = async () => {
      if (!open || !doc?._id || !vehicleId) {
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
  }, [open, doc?._id, doc?.fileUrl, vehicleId]);

  const status = getExpiryStatus(doc?.expiryDate);
  const statusMeta = status ? getStatusMeta(status) : null;

  // History (inactive documents of same type for this vehicle)
  const [histPage, setHistPage] = useState(1);
  const rowsPerPage = 10;
  useEffect(() => {
    if (open) setHistPage(1);
  }, [open, vehicleId, doc?.docType, tab]);
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
      enabled: open && tab === 'history' && !!vehicleId && !!doc?.docType,
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
      onClose();
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
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: 360 } }}
    >
      <Scrollbar>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="h6"> Info </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton onClick={onClose}>
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Stack>
        </Stack>

        <CustomTabs
          value={tab}
          onChange={(_e, v) => setTab(v)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ px: 2.5 }}
        >
          <Tab
            label="Overview"
            value="overview"
            icon={<Iconify icon="solar:info-circle-bold" />}
            iconPosition="start"
          />
          <Tab
            label="History"
            value="history"
            icon={<Iconify icon="mdi:history" />}
            iconPosition="start"
          />
        </CustomTabs>

        {tab === 'overview' && (
          <Stack spacing={2.5} justifyContent="center" sx={{ p: 2.5 }}>
            {loadingUrl ? (
              <CircularProgress size={24} />
            ) : previewUrl ? (
              <FileThumbnail
                imageView
                tooltip
                onDownload={handleDownload}
                file={previewUrl}
                sx={{ width: 'auto', height: 'auto', alignSelf: 'flex-start' }}
                slotProps={{
                  img: { width: 320, height: 'auto', aspectRatio: '4/3', objectFit: 'cover' },
                  icon: { width: 64, height: 64 },
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No file attached
              </Typography>
            )}

            <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
              {doc?.docType || 'Document'}
            </Typography>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack spacing={1.5}>
              <SectionHeader title="Properties" />

              <PropRow label="Vehicle" value={doc?.vehicle?.vehicleNo || doc?.vehicleNo || '-'} />
              <PropRow label="Type" value={doc?.docType || '-'} />
              <PropRow label="Number" value={doc?.docNumber || '-'} />
              <PropRow label="Issuer" value={doc?.issuer || '-'} />
              <PropRow label="Issue" value={doc?.issueDate ? fDateTime(doc.issueDate) : '-'} />
              <PropRow label="Expiry" value={doc?.expiryDate ? fDateTime(doc.expiryDate) : '-'} />
              <PropRow
                label="Status"
                value={
                  statusMeta ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon={statusMeta.icon} sx={{ color: `${statusMeta.color}.main` }} />
                      <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                        {status}
                      </Typography>
                    </Stack>
                  ) : (
                    '-'
                  )
                }
              />
              <PropRow
                label="Created By"
                value={doc?.createdBy?.name || doc?.createdByName || '-'}
              />
            </Stack>
          </Stack>
        )}

        {tab === 'history' && (
          <Box sx={{ p: 2.5 }}>
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
          </Box>
        )}
      </Scrollbar>

      <Box sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <Button
            fullWidth
            variant="soft"
            startIcon={<Iconify icon="eva:edit-2-outline" />}
            onClick={() => setEditOpen(true)}
            disabled={!doc?._id}
          >
            Edit
          </Button>
          <Button
            fullWidth
            variant="soft"
            color="error"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={confirmDelete.onTrue}
            disabled={!doc?._id || !vehicleId || deleting}
          >
            Delete
          </Button>
        </Stack>
      </Box>

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

      <VehicleDocumentFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        vehicleId={vehicleId || undefined}
        mode="edit"
        doc={doc}
      />
    </Drawer>
  );
}

function SectionHeader({ title }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ typography: 'subtitle2' }}
    >
      {title}
    </Stack>
  );
}

function PropRow({ label, value }) {
  return (
    <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
      <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
        {label}
      </Box>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Typography variant="caption" sx={{ flexGrow: 1 }}>
          {value}
        </Typography>
      ) : (
        <Box sx={{ flexGrow: 1 }}>{value}</Box>
      )}
    </Stack>
  );
}

export default DocumentDetailsDrawer;
