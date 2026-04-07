import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';
import { fNumber, fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useSubtripExpenseTypes } from '../../expense/expense-config';

// ----------------------------------------------------------------------

const EVENT_ICONS = {
  CREATED: 'eva:plus-fill',
  MATERIAL_ADDED: 'mdi:package-variant',
  EXPENSE_ADDED: 'mdi:cash-plus',
  EXPENSE_DELETED: 'mdi:cash-minus',
  RECEIVED: 'material-symbols:call-received',
  INVOICE_GENERATED: 'mdi:file-document-edit',
  INVOICE_DELETED: 'mdi:file-document-remove',
  INVOICE_PAID: 'mdi:file-document-check',
  DRIVER_SALARY_GENERATED: 'mdi:cash-check',
  TRANSPORTER_PAYMENT_GENERATED: 'mdi:bank-transfer',
  UPDATED: 'mdi:refresh',
};

function getExpenseLabel(expenseTypes, value) {
  return expenseTypes.find((t) => t.label === value)?.label || value;
}

function formatEventMessage(event, subtripExpenseTypes) {
  const { details = {}, eventType, user } = event;
  const userPrefix = user?.name ? `${user.name}: ` : '';

  // Handle subtrip updates with changed fields
  if (eventType === 'UPDATED') {
    const baseMessage = userPrefix + (details.note || details.message || 'Updated');
    const changed = details.changedFields || {};
    const changeLines = Object.entries(changed)
      .map(([field, change]) => {
        if (change && typeof change === 'object' && 'from' in change && 'to' in change) {
          return `${field}: ${change.from} → ${change.to}`;
        }
        return `${field}: ${change}`;
      })
      .join('\n');
    return changeLines ? `${baseMessage}\n${changeLines}` : baseMessage;
  }

  // 1. Explicit “note” or “message” fields always win
  if (details.note || details.message) {
    return userPrefix + (details.note || details.message);
  }

  // 2. Expense added/removed (you already have this)
  if (details.expenseType && typeof details.amount !== 'undefined') {
    const label = getExpenseLabel(subtripExpenseTypes, details.expenseType);
    const action = eventType === 'EXPENSE_DELETED' ? 'removed' : 'added';
    return `${userPrefix}${label} expense ${action} for ${fCurrency(details.amount)}`;
  }

  // 3. Invoice events
  if (eventType === 'INVOICE_GENERATED' && details.invoiceNo && details.amount != null) {
    return (
      <span>
        {userPrefix}Generated invoice{' '}
        <Link
          component={RouterLink}
          href={paths.dashboard.invoice.details(details.invoiceId)}
          color="primary"
        >
          {details.invoiceNo}
        </Link>{' '}
        for {fCurrency(details.amount)}
      </span>
    );
  }
  if (eventType === 'INVOICE_PAID' && details.invoiceNo) {
    return (
      <span>
        {userPrefix}Marked invoice{' '}
        <Link
          component={RouterLink}
          href={paths.dashboard.invoice.details(details.invoiceId)}
          color="primary"
        >
          {details.invoiceNo}
        </Link>{' '}
        as paid
      </span>
    );
  }
  if (eventType === 'INVOICE_DELETED' && details.invoiceNo) {
    return `${userPrefix}Deleted invoice ${details.invoiceNo}`;
  }

  // Driver salary events (This block is not called because of early return but moving the logic out so it's consistent)
  if (eventType === 'DRIVER_SALARY_GENERATED' && details.paymentId) {
    return (
      <span>
        {userPrefix}Processed driver salary{' '}
        <Link
          component={RouterLink}
          href={paths.dashboard.driverSalary.details(details.salaryId)}
          color="primary"
        >
          {details.paymentId}
        </Link>
      </span>
    );
  }

  // Transporter payment events
  if (eventType === 'TRANSPORTER_PAYMENT_GENERATED' && details.paymentId) {
    return (
      <span>
        {userPrefix}Processed transporter payment{' '}
        <Link
          component={RouterLink}
          href={paths.dashboard.transporterPayment.details(details.paymentReceiptId)}
          color="primary"
        >
          {details.paymentId}
        </Link>
      </span>
    );
  }

  // 4. Material added event
  if (eventType === 'MATERIAL_ADDED') {
    const { materialType, quantity, loadingWeight, rate } = details;
    const parts = [];
    if (materialType) parts.push(materialType);
    if (typeof quantity !== 'undefined') parts.push(`qty ${fNumber(quantity)}`);
    if (typeof loadingWeight !== 'undefined') parts.push(`weight ${fNumber(loadingWeight)}`);
    if (typeof rate !== 'undefined') parts.push(`rate ${fCurrency(rate)}`);
    const detail = parts.join(', ');
    return `${userPrefix}Added material${detail ? ` ${detail}` : ''}`;
  }

  // 5. Received event
  if (eventType === 'RECEIVED' && typeof details.unloadingWeight === 'number') {
    return `${userPrefix}Recorded unloading weight of ${fNumber(details.unloadingWeight)} kg`;
  }

  // 6. Any other details just JSON-dumped (or empty)
  const detailString = JSON.stringify(details);
  return userPrefix + (detailString === '{}' ? '' : detailString);
}

export function SubtripTimeline({ events = [] }) {
  const subtripExpenseTypes = useSubtripExpenseTypes();

  return (
    <Card
      sx={{
        mt: 2,
        height: 400,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader title="Activity timeline" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Timeline
          sx={{
            m: 0,
            p: 3,
            [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 },
          }}
        >
          {events.map((event, index) => (
            <TimelineItem key={event._id}>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <Iconify icon={EVENT_ICONS[event.eventType]} width={24} />
                </TimelineDot>
                {index === events.length - 1 ? null : <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2" color="primary">
                  {event.eventType}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {fDateTime(event.timestamp)}
                </Typography>
                {formatEventMessage(event, subtripExpenseTypes) && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {formatEventMessage(event, subtripExpenseTypes)}
                  </Typography>
                )}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Scrollbar>
    </Card>
  );
}
