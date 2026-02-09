import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

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
    },
    {
        id: 'currentKm',
        label: 'Current Km',
        defaultVisible: true,
        disabled: false,
        getter: (row) => row.currentKm,
        render: (row) => `${row.currentKm || 0} km`,
    },
    {
        id: 'remoldKm',
        label: 'Remold Km',
        defaultVisible: true,
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
        defaultVisible: true,
        disabled: false,
        getter: (row) => row.model,
    },
    {
        id: 'size',
        label: 'Size',
        defaultVisible: true,
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
        id: 'cost',
        label: 'Cost',
        defaultVisible: true,
        disabled: false,
        getter: (row) => row.cost,
        render: (row) => `₹ ${row.cost?.toFixed(2)}`,
    },
    {
        id: 'threadDepth',
        label: 'Thread Depth',
        defaultVisible: true,
        disabled: false,
        getter: (row) => `${row.threadDepth?.current || 0} / ${row.threadDepth?.original || 0} mm`,
    },
];
