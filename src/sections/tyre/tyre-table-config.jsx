import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

import MiniTyreLayout from 'src/sections/vehicle/components/mini-tyre-layout';

// ----------------------------------------------------------------------

export const TYRE_TABLE_COLUMNS = [
    {
        id: 'serialNumber',
        label: 'Tyre Number',
        defaultVisible: true,
        disabled: true, // Always visible
        getter: (row) => row.serialNumber,
        render: (row) => (
            <ListItemText
                disableTypography
                primary={
                    <Link
                        component={RouterLink}
                        to={paths.dashboard.tyre.details(row._id)}
                        variant="body2"
                        noWrap
                        sx={{ color: 'primary.main', cursor: 'pointer' }}
                    >
                        {row.serialNumber}
                    </Link>
                }
            />
        ),
        sortable: true,
    },
    {
        id: 'vehicle',
        label: 'Vehicle',
        defaultVisible: true,
        disabled: false,
        getter: (row) => row.currentVehicleId?.vehicleNo || '-',
        render: (row) =>
            row.currentVehicleId ? (
                <Link
                    component={RouterLink}
                    to={paths.dashboard.vehicle.details(row.currentVehicleId._id)}
                    variant="body2"
                    noWrap
                    sx={{ color: 'primary', cursor: 'pointer' }}
                >
                    {row.currentVehicleId.vehicleNo}
                </Link>
            ) : (
                '-'
            ),
    },
    {
        id: 'currentPosition',
        label: 'Position',
        defaultVisible: true,
        disabled: false,
        getter: (row) => row.currentPosition || '-',
        render: (row) =>
            row.currentVehicleId?.tyreLayoutId && row.currentPosition ? (
                <Tooltip
                    title={
                        <Box sx={{ p: 1 }}>
                            <MiniTyreLayout
                                layoutId={row.currentVehicleId.tyreLayoutId}
                                currentPosition={row.currentPosition}
                                disableTooltip
                            />
                        </Box>
                    }
                    arrow
                    placement="right"
                >
                    <Box
                        component="span"
                        sx={{
                            cursor: 'help',
                            borderBottom: '1px dashed',
                            borderColor: 'text.disabled',
                        }}
                    >
                        {row.currentPosition}
                    </Box>
                </Tooltip>
            ) : (
                '-'
            ),
    },
    {
        id: 'currentKm',
        label: 'Last Recorded KM',
        defaultVisible: true,
        disabled: false,
        getter: (row) => row.currentKm,
        render: (row) => `${row.currentKm || 0} km`,
        sortable: true,
    },
    {
        id: 'remoldKm',
        label: 'Remold Km',
        defaultVisible: false,
        disabled: false,
        getter: (row) => {
            if (row.metadata?.remoldCount > 0) {
                return (row.currentKm || 0) - (row.metadata?.totalKmAtLastRemold || 0);
            }
            return '-';
        },
        render: (row) => {
            if (row.metadata?.remoldCount > 0) {
                const val = (row.currentKm || 0) - (row.metadata?.totalKmAtLastRemold || 0);
                return `${val} km`;
            }
            return '-';
        },
    },
    {
        id: 'brand',
        label: 'Brand',
        defaultVisible: true,
        disabled: false,
        getter: (row) => row.brand,
    },
    {
        id: 'model',
        label: 'Model',
        defaultVisible: false,
        disabled: false,
        getter: (row) => row.model,
    },
    {
        id: 'size',
        label: 'Size',
        defaultVisible: false,
        disabled: false,
        getter: (row) => row.size,
    },
    {
        id: 'type',
        label: 'Type',
        defaultVisible: true,
        disabled: false,
        getter: (row) => row.type,
    },

    {
        id: 'cost',
        label: 'Cost',
        defaultVisible: true,
        disabled: false,
        getter: (row) => row.cost,
        render: (row) => `₹ ${row.cost?.toFixed(2)}`,
        sortable: true,
    },
    {
        id: 'threadDepth',
        label: 'Thread Depth',
        defaultVisible: true,
        disabled: false,
        getter: (row) => `${row.threadDepth?.current || 0} / ${row.threadDepth?.original || 0} mm`,
        sortable: true,
    },

    {
        id: 'createdAt',
        label: 'Added on',
        defaultVisible: false,
        disabled: false,
        getter: (row) => row.createdAt,
        render: (row) => (
            <ListItemText
                primary={fDate(row.createdAt)}
                secondary={fTime(row.createdAt)}
                primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                secondaryTypographyProps={{
                    mt: 0.5,
                    component: 'span',
                    typography: 'caption',
                }}
            />
        ),
        sortable: true,
    },
];
