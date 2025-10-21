import { useMemo, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';
import { fDate } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useInfiniteVehicles } from 'src/query/use-vehicle';
import { useInfiniteDocuments } from 'src/query/use-documents';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingSpinner } from 'src/components/loading-spinner';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { getStatusMeta, getExpiryStatus } from 'src/sections/vehicle/utils/document-utils';

const VEHICLE_PAGE_SIZE = 20;
const DOCS_PAGE_SIZE = 20;

function VehicleFolderCard({ vehicle, onOpen }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Paper
      variant="outlined"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(vehicle)}
      sx={(theme) => ({
        gap: 1,
        p: 2.5,
        maxWidth: 222,
        display: 'flex',
        borderRadius: 2,
        cursor: 'pointer',
        position: 'relative',
        bgcolor: hovered ? 'background.paper' : 'transparent',
        flexDirection: 'column',
        alignItems: 'flex-start',
        boxShadow: hovered ? theme.customShadows.z20 : 'none',
        transition: theme.transitions.create(['background-color', 'box-shadow'], {
          duration: theme.transitions.duration.shorter,
        }),
      })}
    >
      <Box sx={{ width: 36, height: 36 }}>
        <Box
          component="img"
          src={`${CONFIG.site.basePath}/assets/icons/files/ic-folder.svg`}
          sx={{ width: 1, height: 1 }}
        />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" noWrap>
          {vehicle?.vehicleNo || 'Vehicle'}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {vehicle?.vehicleType || '-'}
        </Typography>
      </Box>
    </Paper>
  );
}

function VehicleDocumentsOverlay({ open, onClose, vehicle }) {
  const vehicleId = useMemo(() => vehicle?._id, [vehicle]);
  const [includeInactive, setIncludeInactive] = useState(false);

  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });

  // Single stream when only active docs
  const singleParams = useMemo(
    () => (vehicleId ? { vehicleId, rowsPerPage: DOCS_PAGE_SIZE, isActive: true } : undefined),
    [vehicleId]
  );
  const {
    data: dataSingle,
    fetchNextPage: fetchNextSingle,
    hasNextPage: hasNextSingle,
    isFetchingNextPage: fetchingNextSingle,
    isLoading: isLoadingSingle,
  } = useInfiniteDocuments(singleParams, { enabled: open && !!vehicleId && !includeInactive });

  // Dual streams when including inactive: active + inactive, merged
  const activeParams = useMemo(
    () => (vehicleId ? { vehicleId, rowsPerPage: DOCS_PAGE_SIZE, isActive: true } : undefined),
    [vehicleId]
  );
  const inactiveParams = useMemo(
    () => (vehicleId ? { vehicleId, rowsPerPage: DOCS_PAGE_SIZE, isActive: false } : undefined),
    [vehicleId]
  );
  const {
    data: dataActive,
    fetchNextPage: fetchNextActive,
    hasNextPage: hasNextActive,
    isFetchingNextPage: fetchingNextActive,
    isLoading: isLoadingActive,
  } = useInfiniteDocuments(activeParams, { enabled: open && !!vehicleId && includeInactive });
  const {
    data: dataInactive,
    fetchNextPage: fetchNextInactive,
    hasNextPage: hasNextInactive,
    isFetchingNextPage: fetchingNextInactive,
    isLoading: isLoadingInactive,
  } = useInfiniteDocuments(inactiveParams, { enabled: open && !!vehicleId && includeInactive });

  useEffect(() => {
    if (!inView) return;
    if (!includeInactive) {
      if (hasNextSingle && !fetchingNextSingle) fetchNextSingle();
      return;
    }
    if (hasNextActive && !fetchingNextActive) fetchNextActive();
    if (hasNextInactive && !fetchingNextInactive) fetchNextInactive();
  }, [
    inView,
    includeInactive,
    hasNextSingle,
    fetchingNextSingle,
    fetchNextSingle,
    hasNextActive,
    fetchingNextActive,
    fetchNextActive,
    hasNextInactive,
    fetchingNextInactive,
    fetchNextInactive,
  ]);

  const docsSingle = dataSingle ? dataSingle.pages.flatMap((p) => p.results || []) : [];
  const docsActive = dataActive ? dataActive.pages.flatMap((p) => p.results || []) : [];
  const docsInactive = dataInactive ? dataInactive.pages.flatMap((p) => p.results || []) : [];
  const docs = includeInactive ? [...docsActive, ...docsInactive] : docsSingle;
  const totalSingle = dataSingle?.pages?.[0]?.total || 0;
  const totalActive = dataActive?.pages?.[0]?.total || 0;
  const totalInactive = dataInactive?.pages?.[0]?.total || 0;
  const total = includeInactive ? totalActive + totalInactive : totalSingle;

  const isLoading = includeInactive ? isLoadingActive || isLoadingInactive : isLoadingSingle;
  const isFetchingNextPage = includeInactive
    ? fetchingNextActive || fetchingNextInactive
    : fetchingNextSingle;

  const handleDownload = async (doc) => {
    try {
      const { data: resp } = await axios.get(`/api/documents/${vehicleId}/${doc._id}/download`);
      if (resp?.url) window.open(resp.url, '_blank');
    } catch (e) {
      // swallow; other places toast errors
    }
  };

  const renderStatus = (status) => {
    if (!status) return '-';
    const cfg = getStatusMeta(status);
    if (!cfg) return '-';
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <Iconify icon={cfg.icon} sx={{ color: `${cfg.color}.main` }} />
        <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
          {status}
        </Typography>
      </Stack>
    );
  };

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <DialogTitle sx={{ pr: 2.5 }}>
        Documents — {vehicle?.vehicleNo}
        <Typography component="span" sx={{ color: 'text.secondary', ml: 1 }}>
          ({total})
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 2 }}>
          <FormControlLabel
            sx={{ ml: 'auto' }}
            control={
              <Switch
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.target.checked)}
              />
            }
            label="Include inactive"
          />
        </Stack>
        {isLoading ? (
          <LoadingSpinner sx={{ height: 320 }} />
        ) : (
          <Scrollbar sx={{ maxHeight: 520, px: 0.5 }}>
            <Table size="small" sx={{ minWidth: 960 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Number</TableCell>
                  <TableCell>Issue</TableCell>
                  <TableCell>Expiry</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {docs.map((d) => (
                  <TableRow key={d._id} hover>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{d.docType}</TableCell>
                    <TableCell>{d.docNumber || '-'}</TableCell>
                    <TableCell>{d.issueDate ? fDate(d.issueDate) : '-'}</TableCell>
                    <TableCell>{d.expiryDate ? fDate(d.expiryDate) : '-'}</TableCell>
                    <TableCell>{renderStatus(getExpiryStatus(d.expiryDate))}</TableCell>
                    <TableCell>{d.isActive ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="center">
                      <Button size="small" onClick={() => handleDownload(d)} startIcon={<Iconify icon="eva:download-outline" />}>Download</Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box ref={loadMoreRef} sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                      {isFetchingNextPage && <LoadingSpinner />}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Scrollbar>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function VehicleDocumentsGridView() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteVehicles(
    { rowsPerPage: VEHICLE_PAGE_SIZE, isOwn: true },
    { enabled: true }
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const vehicles = data ? data.pages.flatMap((p) => p.results || []) : [];
  const total = data?.pages?.[0]?.total || 0;

  const handleOpenVehicle = (v) => {
    setSelectedVehicle(v);
    setOverlayOpen(true);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Documents Grid"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vehicle', href: paths.dashboard.vehicle.root },
          { name: 'Documents Grid' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isLoading ? (
        <LoadingSpinner sx={{ height: 320 }} />
      ) : (
        <>
          <Box
            gap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(5, 1fr)',
            }}
          >
            {vehicles.map((v) => (
              <VehicleFolderCard key={v._id} vehicle={v} onOpen={handleOpenVehicle} />)
            )}
          </Box>
          <Box ref={loadMoreRef} sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            {isFetchingNextPage && <LoadingSpinner />}
            {!hasNextPage && (
              <Typography variant="caption" color="text.secondary">
                Showing {vehicles.length} of {total}
              </Typography>
            )}
          </Box>
        </>
      )}

      <VehicleDocumentsOverlay
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        vehicle={selectedVehicle}
      />
    </DashboardContent>
  );
}

export default VehicleDocumentsGridView;
