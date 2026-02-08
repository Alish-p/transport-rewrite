import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Timeline from '@mui/lab/Timeline';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fDateTime } from 'src/utils/format-time';

import { useGetTyreHistory } from 'src/query/use-tyre';

import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export const TYRE_HISTORY_ACTION = {
    THREAD_UPDATE: 'THREAD_UPDATE',
    MOUNT: 'MOUNT',
    UNMOUNT: 'UNMOUNT',
    UPDATE: 'UPDATE',
    SCRAP: 'SCRAP',
};

export default function TyreHistory({ tyreId, ...other }) {
    const { data: history, isLoading } = useGetTyreHistory(tyreId);

    const [filter, setFilter] = useState('ALL');

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredHistory = history?.filter((item) => {
        if (filter === 'ALL') return true;
        return item.action === filter;
    });

    return (
        <Card {...other}>
            <CardHeader
                title="Tyre History"
                action={
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                            value={filter}
                            onChange={handleFilterChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Filter Activity' }}
                        >
                            <MenuItem value="ALL">All Activity</MenuItem>
                            {Object.values(TYRE_HISTORY_ACTION).map((action) => (
                                <MenuItem key={action} value={action}>
                                    {action.replace('_', ' ')}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                }
            />

            {isLoading && (
                <Box sx={{ p: 3, textAlign: 'center' }}>Loading history...</Box>
            )}

            {!isLoading && (!filteredHistory || filteredHistory.length === 0) && (
                <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                    No history available
                </Box>
            )}

            {filteredHistory && filteredHistory.length > 0 && (
                <Scrollbar sx={{ height: 420 }}>
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
                        {filteredHistory.map((item, index) => (
                            <HistoryItem
                                key={item._id}
                                item={item}
                                lastItem={index === filteredHistory.length - 1}
                            />
                        ))}
                    </Timeline>
                </Scrollbar>
            )}
        </Card>
    );
}

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
            case 'SCRAP':
                if (vehicleId) {
                    return `Moved to Scrap from ${vehicleId?.vehicleNo || 'Unknown Vehicle'} at position ${position}. Odometer: ${odometer} km. Distance Covered: ${distanceCovered} km`;
                }
                return `Moved to Scrap`;
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
            case 'SCRAP':
                return 'error';
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
