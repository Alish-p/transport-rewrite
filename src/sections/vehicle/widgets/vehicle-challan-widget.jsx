import { toast } from 'sonner';
import { useMemo, useState, useEffect } from 'react';

import {
  Box,
  Tab,
  Card,
  Tabs,
  Stack,
  Table,
  Button,
  Tooltip,
  TableRow,
  Collapse,
  TableHead,
  TableCell,
  TableBody,
  CardHeader,
  Typography,
  IconButton,
} from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

import { useTenant } from 'src/query/use-tenant';
import { useFetchVehicleChallans, useCachedVehicleChallans } from 'src/query/use-challan';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { TableNoData, TableSkeleton } from 'src/components/table';

function statusMeta(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'pending') return { color: 'warning', icon: 'mdi:clock-outline', label: 'Pending' };
  if (s === 'disposed') return { color: 'success', icon: 'mdi:check-decagram-outline', label: 'Paid' };
  return { color: 'default', icon: 'mdi:help-circle-outline', label: status || '-' };
}

function toDisplayRow(item) {
  // Works for both provider-normalized and DB-cached shapes
  return {
    challanNo: item?.challanNo || '-',
    challanDateTime: item?.challanDateTime || item?.challanDate || null,
    place: item?.place || '-',
    status: item?.status || '-',
    fineImposed: item?.fineImposed ?? item?.amountOfFineImposed ?? null,
    receivedAmount: item?.receivedAmount ?? null,
    courtName: item?.courtName || '-',
    offenceDetails: Array.isArray(item?.offenceDetails) ? item.offenceDetails : [],
    stateCode: item?.stateCode || null,
  };
}

function splitResultsToBuckets(resultsArray) {
  const pending = [];
  const disposed = [];
  (resultsArray || []).forEach((r) => {
    const disp = toDisplayRow(r);
    const status = String(disp.status || '').toLowerCase();
    if (status === 'disposed') disposed.push(disp);
    else pending.push(disp);
  });
  return { pending, disposed, pendingCount: pending.length, disposedCount: disposed.length };
}

export function VehicleChallanWidget({ vehicleNo, isOwn }) {
  const [tab, setTab] = useState('pending');
  const [data, setData] = useState(null);
  const [cooldownInfo, setCooldownInfo] = useState(null);
  const [expanded, setExpanded] = useState(new Set());

  const { data: tenant } = useTenant();
  const integrationEnabled = !!tenant?.integrations?.challanApi?.enabled;

  const { fetchChallans, isFetching } = useFetchVehicleChallans();
  const { data: cached, isLoading: isLoadingCached } = useCachedVehicleChallans(vehicleNo);

  // Auto-seed with cached challans (DB) on mount/update without calling provider
  useEffect(() => {
    if (!cached) return;
    const pending = Array.isArray(cached?.results?.pending)
      ? cached.results.pending.map(toDisplayRow)
      : [];
    const disposed = Array.isArray(cached?.results?.disposed)
      ? cached.results.disposed.map(toDisplayRow)
      : [];
    const pendingCount = cached?.pendingCount ?? pending.length;
    const disposedCount = cached?.disposedCount ?? disposed.length;
    setData((prev) => prev || { pending, disposed, pendingCount, disposedCount, vehicleNo });
    setCooldownInfo({
      lastFetchedAt: cached?.lastFetchedAt || null,
      nextAllowedAt: cached?.nextAllowedAt || null,
      cached: true,
    });
  }, [cached, vehicleNo]);

  const disabledReason = useMemo(() => {
    if (!isOwn) return 'Available only for own vehicles';
    if (!integrationEnabled) return 'Challan integration not enabled';
    if (!vehicleNo) return 'Vehicle number unavailable';
    return null;
  }, [isOwn, integrationEnabled, vehicleNo]);

  const handleFetch = async () => {
    if (disabledReason) return;
    try {
      const res = await fetchChallans({ vehicleNo });
      // Success 200 shape
      const { results, pendingCount = 0, disposedCount = 0 } = res || {};
      const pending = Array.isArray(results?.pending) ? results.pending.map(toDisplayRow) : [];
      const disposed = Array.isArray(results?.disposed) ? results.disposed.map(toDisplayRow) : [];
      setData({ pending, disposed, pendingCount, disposedCount, vehicleNo: res?.vehicleNo });
      setCooldownInfo({
        lastFetchedAt: res?.lastFetchedAt || null,
        nextAllowedAt: res?.nextAllowedAt || null,
        cached: false,
      });
      if (!pending.length && !disposed.length) {
        toast.info('No challans found for this vehicle');
      }
    } catch (e) {
      // 429 cooldown expected here; axios interceptor rejects with response.data
      if (e && (e.cached || e.message)) {
        const { lastFetchedAt, nextAllowedAt } = e || {};
        const resultsArr = Array.isArray(e?.results) ? e.results : [];
        const buckets = splitResultsToBuckets(resultsArr);
        setData({ ...buckets, vehicleNo });
        setCooldownInfo({
          message: e?.message || 'Fetch limited by cooldown',
          lastFetchedAt,
          nextAllowedAt,
          cached: !!e?.cached,
        });
      } else {
        const msg = e?.message || 'Failed to fetch challans';
        toast.error(msg);
      }
    }
  };

  const cooldownActive = useMemo(() => {
    if (!cooldownInfo?.nextAllowedAt) return false;
    const now = new Date();
    const next = new Date(cooldownInfo.nextAllowedAt);
    return next.getTime() > now.getTime();
  }, [cooldownInfo]);

  const counts = useMemo(() => ({
    pending: data?.pendingCount ?? (data?.pending?.length || 0),
    disposed: data?.disposedCount ?? (data?.disposed?.length || 0),
  }), [data]);

  const rows = tab === 'pending' ? data?.pending || [] : data?.disposed || [];

  const rowId = (r) => `${r.challanNo}-${r.challanDateTime || ''}`;
  const isExpanded = (r) => expanded.has(rowId(r));
  const toggleRow = (r) => {
    const id = rowId(r);
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Card>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:police-badge" width={24} />
            <Typography variant="h6">Traffic Challans</Typography>
          </Stack>
        }
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip
              title={
                disabledReason || (cooldownActive && cooldownInfo?.nextAllowedAt
                  ? `Next sync allowed at ${fDateTime(cooldownInfo.nextAllowedAt)}`
                  : 'One provider call per vehicle per 10 days')
              }
            >
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={
                    <Iconify icon={isFetching ? 'line-md:loading-twotone-loop' : 'mdi:cloud-download-outline'} />
                  }
                  onClick={handleFetch}
                  disabled={!!disabledReason || isFetching || cooldownActive}
                >
                  {isFetching ? 'Fetching…' : 'Fetch Challans'}
                </Button>
              </span>
            </Tooltip>
          </Stack>
        }
      />

      <Tabs
        value={tab}
        onChange={(_e, v) => setTab(v)}
        sx={{ px: 3, mt: 1 }}
        variant="scrollable"
        allowScrollButtonsMobile
      >
        <Tab
          value="pending"
          label={`Pending (${counts.pending})`}
          icon={<Iconify icon="mdi:clock-outline" sx={{ color: 'warning.main' }} />}
          iconPosition="start"
        />
        <Tab
          value="disposed"
          label={`Paid (${counts.disposed})`}
          icon={<Iconify icon="mdi:check-decagram-outline" sx={{ color: 'success.main' }} />}
          iconPosition="start"
        />
      </Tabs>

      <Box sx={{ p: 3, pt: 2, overflowX: { xs: 'auto', md: 'visible' } }}>
        {isLoadingCached && !data ? (
          <TableSkeleton sx={{ minWidth: 720 }} rowCount={3} headCount={8} />
        ) : null}
        {isFetching ? (
          <TableSkeleton sx={{ minWidth: 720 }} rowCount={3} headCount={8} />
        ) : (
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell width={48} />
                <TableCell>Challan No</TableCell>
                <TableCell>Date/Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Fine</TableCell>
                <TableCell>Place</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(!rows || rows.length === 0) && (
                <TableNoData
                  notFound
                  title={data ? 'No items' : 'Fetch challans to view records'}
                />
              )}
              {rows?.map((row) => {
                const meta = statusMeta(row.status);
                return (
                  <>
                    <TableRow key={`${row.challanNo}-${row.challanDateTime || ''}`} hover>
                      <TableCell padding="checkbox" sx={{ pr: 0 }}>
                        <IconButton size="small" onClick={() => toggleRow(row)} aria-label="expand row">
                          <Iconify
                            icon={isExpanded(row) ? 'eva:arrow-ios-downward-outline' : 'eva:arrow-ios-forward-outline'}
                          />
                        </IconButton>
                      </TableCell>
                      <TableCell>{row.challanNo}</TableCell>
                      <TableCell>
                        {row.challanDateTime ? fDateTime(row.challanDateTime) : '-'}
                      </TableCell>
                      <TableCell>
                        <Label color={meta.color} startIcon={<Iconify icon={meta.icon} />}
                        >
                          {meta.label}
                        </Label>
                      </TableCell>
                      <TableCell>{row.fineImposed != null ? `₹${row.fineImposed}` : '-'}</TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap title={row.place || ''}>
                          {row.place || '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={isExpanded(row)} timeout="auto" unmountOnExit>
                          <Box sx={{ py: 1.5, px: 1.5, bgcolor: 'background.neutral', borderRadius: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Offence Details
                            </Typography>
                            {(row.offenceDetails && row.offenceDetails.length > 0) ? (
                              <Stack spacing={1}>
                                {row.offenceDetails.map((o, idx) => (
                                  <Stack key={`${row.challanNo}-offence-${idx}`} direction="row" spacing={1.5} alignItems="flex-start">
                                    {o?.act ? (
                                      <Label variant="soft" color="default" startIcon={<Iconify icon="mdi:scale-balance" />}>
                                        {o.act}
                                      </Label>
                                    ) : (
                                      <Box sx={{ width: 0 }} />
                                    )}
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      {o?.name || '-'}
                                    </Typography>
                                  </Stack>
                                ))}
                              </Stack>
                            ) : (
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                No offence details available
                              </Typography>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Box>
    </Card>
  );
}

export default VehicleChallanWidget;
