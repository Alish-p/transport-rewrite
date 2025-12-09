import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { getTenantLogoUrl } from 'src/utils/tenant-branding';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  usePayPurchaseOrder,
  useRejectPurchaseOrder,
  useApprovePurchaseOrder,
  useReceivePurchaseOrder,
} from 'src/query/use-purchase-order';

import { Label } from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useTenantContext } from 'src/auth/tenant';

import { PurchaseOrderToolbar } from '../purchase-order-toolbar';
import { PurchaseOrderStatusStepper } from '../purchase-order-status-stepper';

const STATUS_LABELS = {
  'pending-approval': 'Pending Approval',
  approved: 'Approved',
  purchased: 'Purchased',
  'partial-received': 'Partially Received',
  rejected: 'Rejected',
  received: 'Received',
};

const STATUS_COLORS = {
  'pending-approval': 'warning',
  approved: 'info',
  purchased: 'primary',
  'partial-received': 'warning',
  rejected: 'error',
  received: 'success',
};

export function PurchaseOrderDetailView({ purchaseOrder }) {
  const {
    _id,
    purchaseOrderNo,
    vendor,
    vendorSnapshot,
    partLocation,
    partLocationSnapshot,
    status,
    lines = [],
    description,
    subtotal,
    discountType,
    discount,
    discountAmount,
    shipping,
    taxType,
    tax,
    taxAmount,
    total,
    createdAt,
    orderDate,
  } = purchaseOrder || {};

  const displayVendor = vendorSnapshot || vendor;
  const displayLocation = partLocationSnapshot || partLocation;

  const tenant = useTenantContext();

  const approvePo = useApprovePurchaseOrder();
  const rejectPo = useRejectPurchaseOrder();
  const payPo = usePayPurchaseOrder();
  const receivePo = useReceivePurchaseOrder();

  const approveDialog = useBoolean();
  const rejectDialog = useBoolean();
  const payDialog = useBoolean();
  const receiveDialog = useBoolean();

  const [rejectReason, setRejectReason] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [receiveLines, setReceiveLines] = useState([]);

  const handleCloseRejectDialog = useCallback(() => {
    rejectDialog.onFalse();
    setRejectReason('');
  }, [rejectDialog]);

  const handleClosePayDialog = useCallback(() => {
    payDialog.onFalse();
    setPaymentReference('');
  }, [payDialog]);

  const allFullyReceived =
    Array.isArray(lines) && lines.every((l) => (l.quantityReceived || 0) >= (l.quantityOrdered || 0));

  const actions = [];

  if (status === 'pending-approval') {
    actions.push(
      {
        label: 'Approve',
        icon: 'eva:checkmark-circle-2-outline',
        onClick: approveDialog.onTrue,
      },
      {
        label: 'Reject',
        icon: 'eva:close-circle-outline',
        onClick: rejectDialog.onTrue,
      }
    );
  }

  if (status === 'approved') {
    actions.push({
      label: 'Mark as Paid',
      icon: 'ri:money-rupee-circle-line',
      onClick: payDialog.onTrue,
    });
  }

  if (
    (status === 'approved' || status === 'purchased' || status === 'partial-received') &&
    !allFullyReceived
  ) {
    actions.push({
      label: 'Receive All',
      icon: 'material-symbols:inventory-2-outline',
      onClick: receiveDialog.onTrue,
    });
  }

  const statusLabel = STATUS_LABELS[status] || status;
  const statusColor = STATUS_COLORS[status] || 'default';
  const displayDate = orderDate || createdAt;
  const displayPoNo = purchaseOrderNo || '';

  useEffect(() => {
    if (receiveDialog.value) {
      setReceiveLines(
        (lines || []).map((line, index) => {
          const totalOrdered = line.quantityOrdered || 0;
          const totalReceived = line.quantityReceived || 0;
          const remaining = Math.max(totalOrdered - totalReceived, 0);
          const partName = line.partSnapshot?.name ?? line.part?.name ?? 'Unknown Part';

          return {
            lineId: line._id || String(index),
            partName,
            totalOrdered,
            totalReceived,
            receiveQty: remaining,
            checked: remaining > 0,
          };
        })
      );
    }
  }, [receiveDialog.value, lines]);

  const handleToggleReceiveLine = useCallback((lineId) => {
    setReceiveLines((prev) =>
      prev.map((line) =>
        line.lineId === lineId ? { ...line, checked: !line.checked } : line
      )
    );
  }, []);

  const handleChangeReceiveQty = useCallback((lineId, value) => {
    setReceiveLines((prev) =>
      prev.map((line) => {
        if (line.lineId !== lineId) return line;
        const raw = Number(value);
        const remaining = Math.max(line.totalOrdered - line.totalReceived, 0);
        const safeValue = Number.isNaN(raw) ? 0 : Math.min(Math.max(raw, 0), remaining);
        return { ...line, receiveQty: safeValue };
      })
    );
  }, []);

  const handleApprove = useCallback(async () => {
    try {
      await approvePo(_id);
      approveDialog.onFalse();
    } catch (error) {
      console.error(error);
    }
  }, [approvePo, _id, approveDialog]);

  const handleReject = useCallback(async () => {
    try {
      await rejectPo({ id: _id, reason: rejectReason || '' });
      handleCloseRejectDialog();
    } catch (error) {
      console.error(error);
    }
  }, [rejectPo, _id, rejectReason, handleCloseRejectDialog]);

  const handlePay = useCallback(async () => {
    try {
      await payPo({ id: _id, paymentReference: paymentReference || '' });
      handleClosePayDialog();
    } catch (error) {
      console.error(error);
    }
  }, [payPo, _id, paymentReference, handleClosePayDialog]);

  const handleReceiveAll = useCallback(async () => {
    try {
      const selectedLines = receiveLines.filter(
        (line) => line.checked && line.receiveQty > 0
      );
      if (!selectedLines.length) {
        receiveDialog.onFalse();
        return;
      }

      const payload = {
        lines: selectedLines.map((line) => ({
          lineId: line.lineId,
          quantityToReceive: line.receiveQty,
        })),
      };

      await receivePo({ id: _id, ...payload });
      receiveDialog.onFalse();
    } catch (error) {
      console.error(error);
    }
  }, [receivePo, _id, receiveLines, receiveDialog]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`Purchase Order${displayPoNo ? ` ${displayPoNo}` : ''}`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Purchase Orders', href: paths.dashboard.purchaseOrder.list },
          { name: displayVendor?.name || 'Purchase Order' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PurchaseOrderToolbar purchaseOrder={purchaseOrder} actions={actions} />

      <Stack spacing={3} sx={{ mt: 3 }}>
        <PurchaseOrderStatusStepper status={status} />

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
                {statusLabel || 'Draft'}
              </Label>
              <Typography variant="h6">Purchase Order {[displayPoNo]}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {displayDate ? fDate(displayDate) : '-'}
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
                To (Vendor):
              </Typography>
              {displayVendor ? (
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2">{displayVendor?.name}</Typography>
                  {displayVendor?.address && (
                    <Typography variant="body2">{displayVendor.address}</Typography>
                  )}
                  {displayVendor?.phone && (
                    <Typography variant="body2">Phone: {displayVendor.phone}</Typography>
                  )}
                </Stack>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  -
                </Typography>
              )}
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
                Part Location
              </Typography>
              <Typography variant="subtitle2">
                {displayLocation?.name || '-'}
              </Typography>
            </Stack>

            <Stack sx={{ width: 1 }}>
              <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
                Order Date
              </Typography>
              <Typography variant="subtitle2">
                {displayDate ? fDate(displayDate) : '-'}
              </Typography>
            </Stack>
          </Stack>
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle2" color="green" sx={{ mb: 1 }}>
              Line Items
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Part</TableCell>
                  <TableCell>Part No.</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell align="right">Qty Ordered</TableCell>
                  <TableCell align="right">Qty Received</TableCell>
                  <TableCell align="right">Unit Cost</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lines.map((line, idx) => {
                  const displayPartName =
                    line.partSnapshot?.name ?? line.part?.name ?? 'Unknown Part';
                  const displayPartNumber =
                    line.partSnapshot?.partNumber ?? line.part?.partNumber ?? '-';
                  const displayUnit =
                    line.partSnapshot?.measurementUnit ?? line.part?.measurementUnit ?? '-';

                  return (
                    <TableRow key={line._id || idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{displayPartName}</TableCell>
                      <TableCell>{displayPartNumber}</TableCell>
                      <TableCell>{displayUnit}</TableCell>
                      <TableCell align="right">{line.quantityOrdered}</TableCell>
                      <TableCell align="right">{line.quantityReceived || 0}</TableCell>
                      <TableCell align="right">{fCurrency(line.unitCost || 0)}</TableCell>
                      <TableCell align="right">{fCurrency(line.amount || 0)}</TableCell>
                    </TableRow>
                  );
                })}
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
                  Order Description
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
                  Order Summary
                </Typography>
                <Stack spacing={1.5}>
                  <SummaryRow label="Subtotal" value={fCurrency(subtotal || 0)} />
                  {discount > 0 && (
                    <SummaryRow
                      label={`Discount ${discountType === 'percentage' ? `(${discount}%)` : ''}`}
                      value={`- ${fCurrency(
                        discountAmount ??
                        (discountType === 'percentage'
                          ? ((subtotal || 0) * (discount || 0)) / 100
                          : discount || 0)
                      )}`}
                      color="success.main"
                    />
                  )}
                  {shipping > 0 && (
                    <SummaryRow label="Shipping" value={fCurrency(shipping || 0)} />
                  )}
                  {tax > 0 && (
                    <SummaryRow
                      label={`Tax ${taxType === 'percentage' ? `(${tax}%)` : ''}`}
                      value={fCurrency(
                        taxAmount ??
                        (() => {
                          const effectiveDiscount =
                            discountAmount ??
                            (discountType === 'percentage'
                              ? ((subtotal || 0) * (discount || 0)) / 100
                              : discount || 0);
                          const taxableBase = Math.max((subtotal || 0) - (effectiveDiscount || 0), 0);
                          return taxType === 'percentage'
                            ? (taxableBase * (tax || 0)) / 100
                            : tax || 0;
                        })()
                      )}
                    />
                  )}
                  <Divider sx={{ my: 0.5 }} />
                  <SummaryRow
                    label="Total Amount"
                    value={fCurrency(total || 0)}
                    bold
                    highlight
                  />
                </Stack>
              </Stack>
            </Card>
          </Box>
        </Card>
      </Stack>

      <ConfirmDialog
        open={approveDialog.value}
        onClose={approveDialog.onFalse}
        title="Approve purchase order"
        content="Are you sure you want to approve this purchase order?"
        action={
          <Button variant="contained" color="primary" onClick={handleApprove}>
            Approve
          </Button>
        }
      />

      <ConfirmDialog
        open={rejectDialog.value}
        onClose={handleCloseRejectDialog}
        title="Reject purchase order"
        content={
          <>
            <Typography sx={{ mb: 2 }}>
              Are you sure you want to reject this purchase order?
            </Typography>
            <TextField
              autoFocus
              fullWidth
              multiline
              minRows={2}
              label="Reason (optional)"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
            />
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleReject}>
            Reject
          </Button>
        }
      />

      <ConfirmDialog
        open={payDialog.value}
        onClose={handleClosePayDialog}
        title="Mark as Paid"
        content={
          <TextField
            autoFocus
            fullWidth
            label="Payment reference (optional)"
            value={paymentReference}
            onChange={(event) => setPaymentReference(event.target.value)}
          />
        }
        action={
          <Button variant="contained" onClick={handlePay}>
            Mark as Paid
          </Button>
        }
      />

      <ConfirmDialog
        open={receiveDialog.value}
        onClose={receiveDialog.onFalse}
        title="Receive items"
        maxWidth="md"
        fullWidth
        content={
          <>
            <Typography sx={{ mb: 2 }}>
              Check the box to receive parts into inventory.
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Total Received</TableCell>
                  <TableCell align="right">Total Ordered</TableCell>
                  <TableCell align="right">Receive</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receiveLines.map((line) => {
                  const remaining = Math.max(
                    line.totalOrdered - line.totalReceived,
                    0
                  );
                  return (
                    <TableRow key={line.lineId}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={line.checked}
                          onChange={() => handleToggleReceiveLine(line.lineId)}
                        />
                      </TableCell>
                      <TableCell>{line.partName}</TableCell>
                      <TableCell align="right">
                        {line.totalReceived}
                      </TableCell>
                      <TableCell align="right">
                        {line.totalOrdered}
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          value={line.receiveQty}
                          onChange={(event) =>
                            handleChangeReceiveQty(
                              line.lineId,
                              event.target.value
                            )
                          }
                          inputProps={{
                            min: 0,
                            max: remaining,
                            step: 1,
                          }}
                          sx={{ width: 100 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        }
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={handleReceiveAll}
          >
            Receive
          </Button>
        }
      />
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
