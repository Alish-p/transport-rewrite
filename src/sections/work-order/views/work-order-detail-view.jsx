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
    workOrderNo,
    vehicle,
    status,
    priority,
    category,
    scheduledStartDate,
    actualStartDate,
    completedDate,
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

      <Card sx={{ p: 3 }}>
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
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'background.neutral',
              borderRadius: '10px',
            }}
          />
          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Label variant="soft" color={statusColor}>
              {statusLabel}
            </Label>
            <Typography variant="h6">Work Order</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {workOrderNo ? `Work Order No: ${workOrderNo}` : 'Work Order No: -'}
            </Typography>
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
          <Stack sx={{ width: 1 }}>
            <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
              From:
            </Typography>
            <Stack spacing={1}>
              <Typography variant="subtitle2">{tenant?.name}</Typography>
              <Typography variant="body2">{tenant?.address?.line1}</Typography>
              <Typography variant="body2">{tenant?.address?.line2}</Typography>
              <Typography variant="body2">{tenant?.address?.state}</Typography>
              <Typography variant="body2">Phone: {tenant?.contactDetails?.phone}</Typography>
            </Stack>
          </Stack>

          <Stack sx={{ width: 1 }}>
            <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
              Vehicle & Assignee:
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary', width: 120 }}>
                  Vehicle:
                </Typography>
                <Typography variant="subtitle2">
                  {vehicle?.vehicleNo
                    ? `${vehicle.vehicleNo}${vehicle.vehicleType ? ` (${vehicle.vehicleType})` : ''}`
                    : '-'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary', width: 120 }}>
                  Odometer:
                </Typography>
                <Typography variant="body2">
                  {typeof odometerReading === 'number' ? `${odometerReading} km` : '-'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary', width: 120 }}>
                  Scheduled:
                </Typography>
                <Typography variant="body2">
                  {scheduledStartDate ? fDate(scheduledStartDate) : '-'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary', width: 120 }}>
                  Actual Start:
                </Typography>
                <Typography variant="body2">
                  {actualStartDate ? fDate(actualStartDate) : '-'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary', width: 120 }}>
                  Completed On:
                </Typography>
                <Typography variant="body2">
                  {completedDate ? fDate(completedDate) : '-'}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Stack
          spacing={{ xs: 3, md: 5 }}
          direction={{ xs: 'column', md: 'row' }}
          divider={<Divider flexItem orientation="vertical" sx={{ borderStyle: 'dashed', mt: 4 }} />}
          sx={{ mt: 4 }}
        >
          <Stack sx={{ width: 1 }}>
            <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
              Category
            </Typography>
            <Typography variant="subtitle2">{category || '-'}</Typography>
          </Stack>

          <Stack sx={{ width: 1 }}>
            <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
              Priority
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor:
                    priorityColor === 'default'
                      ? 'text.disabled'
                      : (theme) => theme.palette[priorityColor]?.main || 'text.disabled',
                }}
              />
              <Typography variant="subtitle2">{priorityLabel}</Typography>
            </Stack>
          </Stack>
        </Stack>

        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
            Issues
          </Typography>
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
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">
                      {typeof issue === 'string' ? issue : issue.issue}
                    </Typography>
                    {issue &&
                      typeof issue === 'object' &&
                      issue.assignedTo &&
                      (issue.assignedTo.name || issue.assignedTo.customerName) && (
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}
                        >
                          Assigned to:{' '}
                          {issue.assignedTo.name || issue.assignedTo.customerName}
                        </Typography>
                      )}
                  </Box>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
            Parts Used
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Part</TableCell>
                <TableCell>Part No.</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ color: 'text.secondary' }}>
                    No parts added.
                  </TableCell>
                </TableRow>
              ) : (
                parts.map((line, index) => {
                  const displayPartName =
                    line.partSnapshot?.name ?? line.part?.name ?? 'Unknown Part';
                  const displayPartNumber =
                    line.partSnapshot?.partNumber ?? line.part?.partNumber ?? '-';
                  const displayUnit =
                    line.partSnapshot?.measurementUnit ?? line.part?.measurementUnit ?? '-';

                  return (
                    <TableRow key={line._id || index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{displayPartName}</Typography>
                      </TableCell>
                      <TableCell>{displayPartNumber}</TableCell>
                      <TableCell>{displayUnit}</TableCell>
                      <TableCell>{line.partLocation?.name || '-'}</TableCell>
                      <TableCell align="right">{line.quantity || 0}</TableCell>
                      <TableCell align="right">{fCurrency(line.price || 0)}</TableCell>
                      <TableCell align="right">{fCurrency(line.amount || 0)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>

        <Box
          sx={{
            mt: 4,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
          }}
        >
          <Card
            variant="outlined"
            sx={{ p: 2.5, height: 'fit-content', bgcolor: 'background.neutral' }}
          >
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color="green">
                Description / Notes
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-wrap',
                  color: description ? 'text.primary' : 'text.disabled',
                  lineHeight: 1.7,
                  minHeight: '60px',
                }}
              >
                {description || 'No description provided'}
              </Typography>
            </Stack>
          </Card>

          <Card variant="outlined" sx={{ p: 2.5, bgcolor: 'background.neutral' }}>
            <Stack spacing={2}>
              <Typography variant="subtitle2" color="green">
                Cost Summary
              </Typography>
              <Stack spacing={1.5}>
                <SummaryRow label="Parts Cost" value={fCurrency(computed.partsCost)} />
                <SummaryRow label="Labour Charge" value={fCurrency(computed.labourCharge)} />
                <Divider sx={{ my: 0.5 }} />
                <SummaryRow
                  label="Total Cost"
                  value={fCurrency(computed.totalCost)}
                  bold
                  highlight
                />
              </Stack>
            </Stack>
          </Card>
        </Box>
      </Card>

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

function SummaryRow({ label, value, bold, color, highlight }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography
        variant={bold ? 'subtitle2' : 'body2'}
        sx={{
          color: color || (highlight ? 'primary.main' : 'text.primary'),
          fontWeight: bold || highlight ? 600 : undefined,
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
