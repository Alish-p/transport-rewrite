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

export function SubtripTimeline({ events = [] }) {
    return (
        <Card>
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
                            <Typography variant="subtitle2">{event.eventType}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                {fDateTime(event.timestamp)}
                            </Typography>
                            {event.details && (
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {event.details.note ||
                                        event.details.message ||
                                        JSON.stringify(event.details)}
                                </Typography>
                            )}
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Card>
    );
}