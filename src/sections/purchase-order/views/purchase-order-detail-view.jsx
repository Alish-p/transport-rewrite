import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  usePayPurchaseOrder,
  useRejectPurchaseOrder,
  useApprovePurchaseOrder,
  useReceivePurchaseOrder,
} from 'src/query/use-purchase-order';

import { HeroHeader } from 'src/components/hero-header-card';

const STATUS_LABELS = {
  'pending-approval': 'Pending Approval',
  approved: 'Approved',
  purchased: 'Purchased',
  rejected: 'Rejected',
  received: 'Received',
};

export function PurchaseOrderDetailView({ purchaseOrder }) {
  const {
    _id,
    vendor,
    partLocation,
    status,
    lines = [],
    description,
    subtotal,
    discountType,
    discount,
    shipping,
    taxType,
    tax,
    total,
    createdAt,
  } = purchaseOrder || {};

  const approvePo = useApprovePurchaseOrder();
  const rejectPo = useRejectPurchaseOrder();
  const payPo = usePayPurchaseOrder();
  const receivePo = useReceivePurchaseOrder();

  const allFullyReceived =
    Array.isArray(lines) && lines.every((l) => (l.quantityReceived || 0) >= (l.quantityOrdered || 0));

  const actions = [];

  if (status === 'pending-approval') {
    actions.push(
      {
        label: 'Approve',
        icon: 'eva:checkmark-circle-2-outline',
        onClick: async () => {
          await approvePo(_id);
        },
      },
      {
        label: 'Reject',
        icon: 'eva:close-circle-outline',
        onClick: async () => {
          const reason = window.prompt('Rejection reason (optional):') || '';
          await rejectPo({ id: _id, reason });
        },
      }
    );
  }

  if (status === 'approved') {
    actions.push({
      label: 'Mark as Paid',
      icon: 'ri:money-rupee-circle-line',
      onClick: async () => {
        const paymentReference = window.prompt('Payment reference (optional):') || '';
        await payPo({ id: _id, paymentReference });
      },
    });
  }

  if ((status === 'approved' || status === 'purchased') && !allFullyReceived) {
    actions.push({
      label: 'Receive All',
      icon: 'material-symbols:inventory-2-outline',
      onClick: async () => {
        const confirm = window.confirm(
          'Mark all items as fully received and update stock?'
        );
        if (!confirm) return;
        const payload = {
          lines: lines.map((line) => ({
            lineId: line._id,
            quantityReceived: line.quantityOrdered,
          })),
        };
        await receivePo({ id: _id, ...payload });
      },
    });
  }

  const statusLabel = STATUS_LABELS[status] || status;

  return (
    <DashboardContent>
      <HeroHeader
        offsetTop={70}
        title={vendor?.name || 'Purchase Order'}
        status={statusLabel}
        icon="mdi:file-document-outline"
        meta={[
          { icon: 'mdi:factory', label: vendor?.name || '-' },
          { icon: 'mdi:map-marker', label: partLocation?.name || '-' },
          { icon: 'mdi:calendar', label: createdAt ? fDate(createdAt) : '-' },
        ]}
        actions={actions}
      />

      <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Card>
          <CardHeader title="Line Items" />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Part</TableCell>
                <TableCell align="right">Qty Ordered</TableCell>
                <TableCell align="right">Qty Received</TableCell>
                <TableCell align="right">Unit Cost</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lines.map((line, idx) => (
                <TableRow key={line._id || idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{line.part?.name || '-'}</TableCell>
                  <TableCell align="right">{line.quantityOrdered}</TableCell>
                  <TableCell align="right">{line.quantityReceived || 0}</TableCell>
                  <TableCell align="right">{fCurrency(line.unitCost || 0)}</TableCell>
                  <TableCell align="right">{fCurrency(line.amount || 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {description && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {description}
                </Typography>
              </Box>
            </>
          )}
        </Card>

        <Card>
          <CardHeader title="Summary" />
          <Stack spacing={1.5} sx={{ p: 3 }}>
            <SummaryRow label="Subtotal" value={fCurrency(subtotal || 0)} />
            <SummaryRow
              label={`Discount (${discountType === 'percentage' ? `${discount || 0}%` : 'fixed'})`}
              value={`- ${fCurrency(discount || 0)}`}
            />
            <SummaryRow label="Shipping" value={fCurrency(shipping || 0)} />
            <SummaryRow
              label={`Tax (${taxType === 'percentage' ? `${tax || 0}%` : 'fixed'})`}
              value={fCurrency(tax || 0)}
            />
            <Divider sx={{ my: 1.5 }} />
            <SummaryRow label="Total" value={fCurrency(total || 0)} bold />
          </Stack>
        </Card>
      </Box>
    </DashboardContent>
  );
}

function SummaryRow({ label, value, bold }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant={bold ? 'subtitle2' : 'body2'}>{value}</Typography>
    </Stack>
  );
}

