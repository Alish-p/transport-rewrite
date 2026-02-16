import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
// import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { usePopover } from 'src/components/custom-popover';
import { DialogSelectButton } from 'src/components/dialog-select-button/dialog-select-button';

import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';

// import { TYRE_TYPE } from './tyre-constants';

// ----------------------------------------------------------------------

export default function TyreFiltersDrawer({
    open,
    onClose,
    //
    filters,
    onFilters,
    //
    onResetFilters,
    ...props
}) {
    // Vehicle related hooks
    const vehiclePopover = usePopover();

    const handleFilterTyreNumber = (event) => {
        onFilters('serialNumber', event.target.value);
    };

    const handleFilterBrand = (event) => {
        onFilters('brand', event.target.value);
    };

    const handleFilterVehicle = (vehicle) => {
        onFilters('vehicle', vehicle?._id || null);
    };

    const handleFilterModel = (event) => {
        onFilters('model', event.target.value);
    };

    const handleFilterSize = (event) => {
        onFilters('size', event.target.value);
    };

    // const handleFilterKm = (event, newValue) => {
    //     onFilters('currentKm', newValue);
    // };

    const renderHead = (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: 2, px: 2.5 }}
        >
            <Typography variant="h6">Filters</Typography>

            <IconButton onClick={onClose}>
                <Iconify icon="mingcute:close-line" />
            </IconButton>
        </Stack>
    );

    // We need to render the new inputs
    const renderFilters = (
        <Stack spacing={3}>
            <TextField
                fullWidth
                value={filters.serialNumber}
                onChange={handleFilterTyreNumber}
                placeholder="Search Tyre Number..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                    ),
                }}
            />

            <TextField
                fullWidth
                value={filters.brand}
                onChange={handleFilterBrand}
                placeholder="Search Brand..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                    ),
                }}
            />

            <TextField
                fullWidth
                value={filters.model}
                onChange={handleFilterModel}
                placeholder="Search Model..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                    ),
                }}
            />

            <TextField
                fullWidth
                value={filters.size}
                onChange={handleFilterSize}
                placeholder="Search Size..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                    ),
                }}
            />

            <DialogSelectButton
                fullWidth
                onClick={vehiclePopover.onOpen}
                disabled={false}
                iconName="mdi:truck-outline"
                placeholder="Filter by Vehicle"
                selected={props.vehicleData?.vehicleNo}
                onClear={() => handleFilterVehicle(null)}
            />
            {/* The dialog needs to be somewhere. Can be outside renderFilters stack or inside, usually fine inside if properly memoized/rendered. */}
        </Stack>
    );



    const renderKm = (
        <Stack spacing={1} sx={{ mt: 1 }}>
            <Typography variant="subtitle2">Current Km Range</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
                <TextField
                    size="small"
                    type="number"
                    placeholder="Min Km"
                    value={filters.minKm ?? ''}
                    onChange={(event) => onFilters('minKm', event.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">km</InputAdornment>,
                    }}
                />
                <Typography>-</Typography>
                <TextField
                    size="small"
                    type="number"
                    placeholder="Max Km"
                    value={filters.maxKm ?? ''}
                    onChange={(event) => onFilters('maxKm', event.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">km</InputAdornment>,
                    }}
                />
            </Stack>
        </Stack>
    );

    const renderThread = (
        <Stack spacing={1} sx={{ mt: 1 }}>
            <Typography variant="subtitle2">Current Thread Range</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
                <TextField
                    size="small"
                    type="number"
                    placeholder="Min"
                    value={filters.minThread ?? ''}
                    onChange={(event) => onFilters('minThread', event.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                    }}
                />
                <Typography>-</Typography>
                <TextField
                    size="small"
                    type="number"
                    placeholder="Max"
                    value={filters.maxThread ?? ''}
                    onChange={(event) => onFilters('maxThread', event.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                    }}
                />
            </Stack>
        </Stack>
    );

    return (
        <>
            <Drawer
                anchor="left"
                open={open}
                onClose={onClose}
                slotProps={{
                    backdrop: { invisible: true },
                }}
                PaperProps={{
                    sx: { width: 320 },
                }}
            >
                {renderHead}

                <Divider />

                <Scrollbar>
                    <Stack spacing={3} sx={{ p: 2.5 }}>
                        {renderFilters}
                        {renderKm}
                        {renderThread}
                    </Stack>
                </Scrollbar>

                <Box sx={{ p: 2.5 }}>
                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        color="inherit"
                        variant="outlined"
                        onClick={onResetFilters}
                        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                    >
                        Clear All
                    </Button>
                </Box>
            </Drawer>
            <KanbanVehicleDialog
                open={vehiclePopover.open}
                onClose={vehiclePopover.onClose}
                onVehicleChange={handleFilterVehicle}
                onlyOwn
            />
        </>
    );
}
