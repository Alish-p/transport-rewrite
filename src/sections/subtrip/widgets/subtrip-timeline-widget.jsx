import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
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

const getEventIcon = (eventType) => {
  switch (eventType) {
    case 'CREATED':
      return 'solar:sort-by-time-bold-duotone';
    case 'MATERIAL_ADDED':
      return 'mdi:truck';
    case 'LOADED':
      return 'mdi:truck';
    case 'UNLOADED':
      return 'material-symbols:call-received';
    case 'COMPLETED':
      return 'mdi:progress-tick';
    case 'ERROR':
      return 'material-symbols:error-outline';

    case 'EXPENSE_ADDED':
      return 'mdi:currency-usd';
    default:
      return 'solar:sort-by-time-bold-duotone';
  }
};

const getEventColor = (eventType) => {
  switch (eventType) {
    case 'CREATED':
      return 'primary';
    case 'MATERIAL_ADDED':
      return 'warning';
    case 'LOADED':
      return 'warning';
    case 'UNLOADED':
      return 'info';
    case 'COMPLETED':
      return 'success';
    case 'ERROR':
      return 'error';

    case 'EXPENSE_ADDED':
      return 'success';
    default:
      return 'default';
  }
};

const getEventTitle = (event) => {
  const { eventType } = event;
  switch (eventType) {
    case 'CREATED':
      return 'Subtrip Created';
    case 'MATERIAL_ADDED':
      return 'Material Added';
    case 'LOADED':
      return 'Material Loaded';
    case 'UNLOADED':
      return 'Material Unloaded';
    case 'COMPLETED':
      return 'Subtrip Completed';
    case 'ERROR':
      return 'Error Occurred';
    case 'EXPENSE_ADDED':
      return 'Expense Added';
    default:
      return eventType;
  }
};

export function SubtripTimeline({ events = [] }) {
  return (
    <Card sx={{ boxShadow: 2, my: 2 }}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">Subtrip Timeline</Typography>
          </Stack>
        }
      />

      <Timeline
        sx={{
          m: 0,
          p: 3,
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {events.map((event, index) => (
          <TimelineItem key={event._id}>
            <TimelineSeparator>
              <TimelineDot color={getEventColor(event.eventType)}>
                <Iconify icon={getEventIcon(event.eventType)} width={16} />
              </TimelineDot>
              {index !== events.length - 1 && <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Typography variant="subtitle2">{getEventTitle(event)}</Typography>

              {event.details && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  {event.eventType === 'MATERIAL_ADDED' && (
                    <>
                      {event.details.materialType} - {event.details.quantity} units
                      {event.details.grade && ` (Grade: ${event.details.grade})`}
                    </>
                  )}
                  {event.eventType === 'EXPENSE_ADDED' && (
                    <>
                      {event.details.expenseType}: ₹{event.details.amount}
                    </>
                  )}
                  {event.details.note && <>{event.details.note}</>}
                </Typography>
              )}

              <Typography
                variant="caption"
                sx={{ color: 'text.disabled', display: 'block', mt: 0.5 }}
              >
                {fDateTime(event.timestamp)}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Card>
  );
}
