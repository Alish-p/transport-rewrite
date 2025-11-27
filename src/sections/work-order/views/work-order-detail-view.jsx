import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { getTenantLogoUrl } from 'src/utils/tenant-branding';

import { DashboardContent } from 'src/layouts/dashboard';
import { useCloseWorkOrder } from 'src/query/use-work-order';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useTenantContext } from 'src/auth/tenant';

import {
  WORK_ORDER_STATUS_LABELS,
  WORK_ORDER_STATUS_COLORS,
  WORK_ORDER_PRIORITY_LABELS,
  WORK_ORDER_PRIORITY_COLORS,
} from '../work-order-config';

export function WorkOrderDetailView({ workOrder }) {
  const router = useRouter();
  const tenant = useTenantContext();
  const closeDialog = useBoolean(false);
  const closeWorkOrder = useCloseWorkOrder();
  const [isClosing, setIsClosing] = useState(false);

  const {
    _id,
    vehicle,
    status,
    priority,
    scheduledStartDate,
    actualStartDate,
    completedDate,
    assignedTo,
    odometerReading,
    labourCharge,
    partsCost,
    totalCost,
    description,
    parts = [],
    createdAt,
    issues = [],
  } = workOrder || {};

  const statusLabel = WORK_ORDER_STATUS_LABELS[status] || status || 'Unknown';
  const statusColor = WORK_ORDER_STATUS_COLORS[status] || 'default';

  const priorityLabel =
    WORK_ORDER_PRIORITY_LABELS[priority] || priority || 'Unknown';
  const priorityColor =
    WORK_ORDER_PRIORITY_COLORS[priority] || 'default';

  const computed = useMemo(
    () => ({
      partsCost: typeof partsCost === 'number' ? partsCost : 0,
      labourCharge: typeof labourCharge === 'number' ? labourCharge : 0,
      totalCost: typeof totalCost === 'number' ? totalCost : 0,
    }),
    [partsCost, labourCharge, totalCost]
  );

  const handleEdit = useCallback(() => {
    if (!_id) return;
    router.push(paths.dashboard.workOrder.edit(_id));
  }, [_id, router]);

  const handleConfirmClose = useCallback(async () => {
    if (!_id) return;
    try {
      setIsClosing(true);
      await closeWorkOrder(_id);
      closeDialog.onFalse();
    } catch (error) {
      // error toast handled in hook
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsClosing(false);
    }
  }, [_id, closeDialog, closeWorkOrder]);

  const canClose = status !== 'completed';

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={vehicle?.vehicleNo || 'Work Order'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Work Orders', href: paths.dashboard.workOrder.list },
          { name: vehicle?.vehicleNo || 'Work Order' },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="solar:pen-bold" />}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              startIcon={<Iconify icon="mdi:check-decagram-outline" />}
              onClick={closeDialog.onTrue}
              disabled={!canClose}
            >
              {canClose ? 'Close Work Order' : 'Already Closed'}
            </Button>
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={3}>
        <Card sx={{ p: 3 }}>
          {/* Header block – mirrors WorkOrderForm header layout */}
          <Box sx={{ mb: 3 }}>
            <Box
              rowGap={3}
              display="grid"
              alignItems="center"
              gridTemplateColumns={{ xs: '1fr', sm: '1fr auto' }}
              sx={{ mb: 3 }}
            >
              <Box
                component="img"
                alt="logo"
                src={getTenantLogoUrl(tenant)}
                sx={{ width: 60, height: 60, bgcolor: 'background.neutral', borderRadius: 1 }}
              />
              <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                <Label variant="soft" color={statusColor}>
                  {statusLabel}
                </Label>
                <Typography variant="h6">Work Order</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {createdAt ? fDate(createdAt) : '-'}
                </Typography>
              </Stack>
            </Box>

            <Stack
              spacing={{ xs: 3, md: 5 }}
              direction={{ xs: 'column', md: 'row' }}
              divider={<Divider flexItem orientation="vertical" sx={{ borderStyle: 'dashed' }} />}
            >
              {/* From: Tenant */}
              <Stack sx={{ width: 1 }}>
                <Typography variant="h6" sx={{ color: 'text.disabled', mb: 1 }}>
                  From:
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">{tenant?.name}</Typography>
                  <Typography variant="body2">{tenant?.address?.line1}</Typography>
                  <Typography variant="body2">{tenant?.address?.line2}</Typography>
                  <Typography variant="body2">{tenant?.address?.state}</Typography>
                  <Typography variant="body2">
                    Phone: {tenant?.contactDetails?.phone}
                  </Typography>
                </Stack>
              </Stack>

              {/* Vehicle & Assignee (read-only) */}
              <Stack sx={{ width: 1 }}>
                <Typography variant="h6" sx={{ color: 'text.disabled', mb: 1 }}>
                  Vehicle &amp; Assignee
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="body2" sx={{ minWidth: 96 }}>
                      Vehicle:
                    </Typography>
                    <Typography variant="body2">
                      {vehicle?.vehicleNo
                        ? `${vehicle.vehicleNo}${vehicle.vehicleType ? ` (${vehicle.vehicleType})` : ''}`
                        : '-'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="body2" sx={{ minWidth: 96 }}>
                      Assignee:
                    </Typography>
                    <Typography variant="body2">
                      {assignedTo?.name || assignedTo?.customerName || '-'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="body2" sx={{ minWidth: 96 }}>
                      Odometer:
                    </Typography>
                    <Typography variant="body2">
                      {typeof odometerReading === 'number' ? `${odometerReading} km` : '-'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="body2" sx={{ minWidth: 96 }}>
                      Scheduled:
                    </Typography>
                    <Typography variant="body2">
                      {scheduledStartDate ? fDate(scheduledStartDate) : '-'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="body2" sx={{ minWidth: 96 }}>
                      Actual Start:
                    </Typography>
                    <Typography variant="body2">
                      {actualStartDate ? fDate(actualStartDate) : '-'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="body2" sx={{ minWidth: 96 }}>
                      Completed On:
                    </Typography>
                    <Typography variant="body2">
                      {completedDate ? fDate(completedDate) : '-'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="body2" sx={{ minWidth: 96 }}>
                      Priority:
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor:
                            priorityColor === 'default'
                              ? 'text.disabled'
                              : (theme) => theme.palette[priorityColor]?.main || 'text.disabled',
                        }}
                      />
                      <Label color={priorityColor} variant="soft">
                        {priorityLabel}
                      </Label>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Box>

          {description && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <Iconify icon="solar:document-text-bold-duotone" width={20} />
                  <Typography variant="subtitle2">Description / Notes</Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'pre-line' }}
                >
                  {description}
                </Typography>
              </Box>
            </>
          )}
        </Card>

        {/* Issues block – mirrors WorkOrderForm issues section in read-only mode */}
        <Card
          sx={{
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Iconify icon="mdi:alert-circle-outline" width={20} />
                <Typography variant="h6">Issues</Typography>
              </Stack>
            </Stack>

            {!issues || issues.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No issues recorded for this work order.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {issues.map((issue, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', minWidth: 20 }}
                    >
                      {index + 1}.
                    </Typography>
                    <Typography variant="body2">{issue}</Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Parts
          </Typography>

          {parts.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}
            >
              No parts added to this work order.
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Part</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parts.map((line, index) => (
                    <TableRow key={line._id || index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {line.part?.name || '-'}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {line.part?.partNumber || ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {line.partLocation?.name || '-'}
                      </TableCell>
                      <TableCell align="right">
                        {line.quantity || 0}
                      </TableCell>
                      <TableCell align="right">
                        {fCurrency(line.price || 0)}
                      </TableCell>
                      <TableCell align="right">
                        {fCurrency(line.amount || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
            }}
          >
            <Box />
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary' }}
                >
                  Parts Cost
                </Typography>
                <Typography variant="subtitle2">
                  {fCurrency(computed.partsCost)}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary' }}
                >
                  Labour Charge
                </Typography>
                <Typography variant="subtitle2">
                  {fCurrency(computed.labourCharge)}
                </Typography>
              </Stack>
              <Divider />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700 }}
                >
                  Total Cost
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                  }}
                >
                  {fCurrency(computed.totalCost)}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Card>
      </Stack>

      <Dialog
        open={closeDialog.value}
        onClose={closeDialog.onFalse}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Close Work Order</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This will mark the work order as{' '}
            <strong>Completed</strong> and adjust inventory for all
            parts used.
          </Typography>
          <Typography variant="body2">
            Are you sure you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog.onFalse} disabled={isClosing}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmClose}
            disabled={isClosing}
            startIcon={
              isClosing ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Iconify icon="mdi:check-decagram-outline" />
              )
            }
          >
            {isClosing ? 'Closing...' : 'Confirm Close'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
