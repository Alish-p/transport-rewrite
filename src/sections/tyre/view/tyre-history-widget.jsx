import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
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

import { useGetTyreHistory } from 'src/query/use-tyre';

// ----------------------------------------------------------------------

export default function TyreHistory({ tyreId, ...other }) {
    const { data: history, isLoading } = useGetTyreHistory(tyreId);

    return (
        <Card {...other}>
            <CardHeader title="Tyre History" />

            {isLoading && (
                <Box sx={{ p: 3, textAlign: 'center' }}>Loading history...</Box>
            )}

            {!isLoading && (!history || history.length === 0) && (
                <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                    No history available
                </Box>
            )}

            {history && history.length > 0 && (
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
                    {history.map((item, index) => (
                        <HistoryItem
                            key={item._id}
                            item={item}
                            lastItem={index === history.length - 1}
                        />
                    ))}
                </Timeline>
            )}
        </Card>
    );
}

TyreHistory.propTypes = {
    tyreId: PropTypes.string,
};

// ----------------------------------------------------------------------

function HistoryItem({ item, lastItem }) {
    const { action, measuringDate, vehicleId, position, odometer, newThreadDepth, previousThreadDepth, distanceCovered } = item;

    const renderContent = () => {
        switch (action) {
            case 'MOUNT':
                return `Mounted on ${vehicleId?.vehicleNo || 'Unknown Vehicle'} at position ${position}. Odometer: ${odometer} km`;
            case 'UNMOUNT':
                return `Unmounted. Odometer: ${odometer} km. Distance Covered: ${distanceCovered} km`;
            case 'THREAD_UPDATE':
                return `Thread depth updated from ${previousThreadDepth}mm to ${newThreadDepth}mm`;
            case 'UPDATE':
                return `Tyre details updated`;
            default:
                return action;
        }
    };

    const getColor = () => {
        switch (action) {
            case 'MOUNT':
                return 'success';
            case 'UNMOUNT':
                return 'warning';
            case 'THREAD_UPDATE':
                return 'info';
            default:
                return 'primary';
        }
    }

    return (
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot color={getColor()} />
                {lastItem ? null : <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
                <Typography variant="subtitle2">{renderContent()}</Typography>

                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {fDateTime(measuringDate)}
                </Typography>
            </TimelineContent>
        </TimelineItem>
    );
}

HistoryItem.propTypes = {
    item: PropTypes.object,
    lastItem: PropTypes.bool,
};
