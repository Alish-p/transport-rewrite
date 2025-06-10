import Card from '@mui/material/Card';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { subtripExpenseTypes } from '../../expense/expense-config';

// ----------------------------------------------------------------------

const EVENT_ICONS = {
    CREATED: 'eva:plus-fill',
    EXPENSE_ADDED: 'mdi:cash-plus',
    EXPENSE_DELETED: 'mdi:cash-minus',
    RECEIVED: 'material-symbols:call-received',
    INVOICE_GENERATED: 'mdi:file-document-edit',
    INVOICE_DELETED: 'mdi:file-document-remove',
    INVOICE_PAID: 'mdi:file-document-check',
    UPDATED: 'mdi:refresh',
};

const EVENT_COLORS = {
    CREATED: 'primary',
    EXPENSE_ADDED: 'success',
    EXPENSE_DELETED: 'error',
    RECEIVED: 'info',
    INVOICE_GENERATED: 'warning',
    INVOICE_DELETED: 'error',
    INVOICE_PAID: 'success',
    UPDATED: 'secondary',
};

function getExpenseLabel(value) {
    return subtripExpenseTypes.find((t) => t.value === value)?.label || value;
}

function formatEventMessage(event) {
    const { details = {}, eventType, user } = event;
    const userPrefix = user?.name ? `${user.name}: ` : '';

    // 1. Explicit “note” or “message” fields always win
    if (details.note || details.message) {
        return userPrefix + (details.note || details.message);
    }

    // 2. Expense added/removed (you already have this)
    if (details.expenseType && typeof details.amount !== 'undefined') {
        const label = getExpenseLabel(details.expenseType);
        const action = eventType === 'EXPENSE_DELETED' ? 'removed' : 'added';
        return `${userPrefix}${label} expense ${action} for ₹${details.amount}`;
    }

    // 3. Invoice events
    if (eventType === 'INVOICE_GENERATED' && details.invoiceNo && details.amount != null) {
        return `${userPrefix}Generated invoice ${details.invoiceNo} for ₹${details.amount}`;
    }
    if (eventType === 'INVOICE_PAID' && details.invoiceNo) {
        return `${userPrefix}Marked invoice ${details.invoiceNo} as paid`;
    }
    if (eventType === 'INVOICE_DELETED' && details.invoiceNo) {
        return `${userPrefix}Deleted invoice ${details.invoiceNo}`;
    }

    // 4. Received event
    if (eventType === 'RECEIVED' && typeof details.unloadingWeight === 'number') {
        return `${userPrefix}Recorded unloading weight of ${details.unloadingWeight} kg`;
    }

    // 5. Any other details just JSON-dumped (or empty)
    const detailString = JSON.stringify(details);
    return userPrefix + (detailString === '{}' ? '' : detailString);
}

export function SubtripTimeline({ events = [] }) {
    return (
        <Card sx={{ mt: 2 }}>
            <CardHeader title="Activity timeline" />
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
                            <TimelineDot color={EVENT_COLORS[event.eventType] || 'primary'}>
                                <Iconify icon={EVENT_ICONS[event.eventType]} width={24} />
                            </TimelineDot>
                            {index === events.length - 1 ? null : <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="subtitle2" color='primary'>{event.eventType}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                {fDateTime(event.timestamp)}
                            </Typography>
                            {formatEventMessage(event) && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        whiteSpace: 'pre-line',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {formatEventMessage(event)}
                                </Typography>
                            )}
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Card>
    );
}
