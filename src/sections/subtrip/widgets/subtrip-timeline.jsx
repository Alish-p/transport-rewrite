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
import { Scrollbar } from 'src/components/scrollbar';
import { EventMessage } from 'src/components/event-message/event-message';

// ----------------------------------------------------------------------

const EVENT_ICONS = {
  CREATED: 'eva:plus-fill',
  MATERIAL_ADDED: 'mdi:package-variant',
  EXPENSE_ADDED: 'mdi:cash-plus',
  EXPENSE_DELETED: 'mdi:cash-minus',
  EXPENSE_CANCELLED: 'mdi:cash-minus',
  RECEIVED: 'material-symbols:call-received',
  INVOICE_GENERATED: 'mdi:file-document-edit',
  INVOICE_DELETED: 'mdi:file-document-remove',
  INVOICE_PAID: 'mdi:file-document-check',
  DRIVER_SALARY_GENERATED: 'mdi:cash-check',
  DRIVER_SALARY_CANCELLED: 'mdi:cash-remove',
  TRANSPORTER_PAYMENT_GENERATED: 'mdi:bank-transfer',
  TRANSPORTER_PAYMENT_PAID: 'mdi:bank-check',
  TRANSPORTER_PAYMENT_CANCELLED: 'mdi:bank-remove',
  UPDATED: 'mdi:refresh',
  STATUS_CHANGED: 'mdi:swap-horizontal',
  ERROR_REPORTED: 'mdi:alert-circle-outline',
  ERROR_RESOLVED: 'mdi:check-circle-outline',
  EPOD_SUBMITTED: 'mdi:file-check-outline',
  ADVANCE_ADDED: 'mdi:cash-plus',
  ADVANCE_DELETED: 'mdi:cash-minus',
  ADVANCE_CANCELLED: 'mdi:cash-minus',
  SUBTRIP_CANCELLED: 'material-symbols:cancel-outline',
};

const EVENT_COLORS = {
  CREATED: 'primary',
  MATERIAL_ADDED: 'info',
  EXPENSE_ADDED: 'info',
  EXPENSE_DELETED: 'error',
  EXPENSE_CANCELLED: 'error',
  RECEIVED: 'success',
  ERROR_REPORTED: 'warning',
  ERROR_RESOLVED: 'success',
  INVOICE_GENERATED: 'info',
  INVOICE_DELETED: 'error',
  INVOICE_PAID: 'success',
  DRIVER_SALARY_GENERATED: 'success',
  DRIVER_SALARY_CANCELLED: 'error',
  TRANSPORTER_PAYMENT_GENERATED: 'success',
  TRANSPORTER_PAYMENT_PAID: 'success',
  TRANSPORTER_PAYMENT_CANCELLED: 'error',
  SUBTRIP_CANCELLED: 'error',
  UPDATED: 'grey',
  STATUS_CHANGED: 'grey',
  ADVANCE_ADDED: 'info',
  ADVANCE_DELETED: 'error',
  ADVANCE_CANCELLED: 'error',
  EPOD_SUBMITTED: 'success',
};

// ----------------------------------------------------------------------

export function SubtripTimeline({ events = [], sx, ...other }) {
  return (
    <Card
      sx={{
        height: 400,
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
      {...other}
    >
      <CardHeader
        title="Activity Timeline"
        avatar={<Iconify icon="solar:history-bold" color="primary.main" width={24} />}
        sx={{
          p: 2.5,
          pb: 1,
          '& .MuiCardHeader-avatar': { mr: 1 },
          '& .MuiCardHeader-title': { fontWeight: 'fontWeightBold' },
        }}
      />
      <Scrollbar sx={{ flexGrow: 1 }}>
        {events.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', p: 3, textAlign: 'center' }}
          >
            No activity recorded yet
          </Typography>
        ) : (
          <Timeline
            sx={{
              m: 0,
              p: 2.5,
              [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 },
            }}
          >
            {events.map((event, index) => {
              const eventColor = EVENT_COLORS[event.eventType] || 'primary';
              const titleColor = eventColor === 'grey' ? 'text.secondary' : eventColor;

              return (
                <TimelineItem key={event._id}>
                  <TimelineSeparator>
                    <TimelineDot color={eventColor}>
                      <Iconify icon={EVENT_ICONS[event.eventType] || 'eva:activity-fill'} width={20} />
                    </TimelineDot>
                    {index === events.length - 1 ? null : <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="subtitle2" color={titleColor}>
                      {event.eventType}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {fDateTime(event.timestamp)}
                    </Typography>
                    <EventMessage message={event.displayMessage} />
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        )}
      </Scrollbar>
    </Card>
  );
}
