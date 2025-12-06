import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { MenuList, Checkbox, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useMaterialOptions } from 'src/hooks/use-material-options';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DialogSelectButton } from 'src/components/dialog-select-button';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker';

// ----------------------------------------------------------------------

export default function SubtripFiltersDrawer({
    open,
    onClose,
    filters,
    onFilters,
    //
    transporterDialog,
    customerDialog,
    vehicleDialog,
    driverDialog,
    //
    selectedTransporter,
    selectedCustomer,
    selectedVehicle,
    selectedDriver,
}) {
    const materialPopover = usePopover();
    const materialOptions = useMaterialOptions();

    const startRange = useBoolean();
    const endRange = useBoolean();

    const handleToggleMaterial = (value) => {
        const current = Array.isArray(filters.materials) ? [...filters.materials] : [];
        const newValues = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        onFilters('materials', newValues);
    };

    const handleFilterSubtripId = (event) => {
        onFilters('subtripNo', event.target.value);
    };

    const handleFilterReferenceSubtripNo = (event) => {
        onFilters('referenceSubtripNo', event.target.value);
    };

    const handleFilterVehicleOwnership = (event) => {
        onFilters('vehicleOwnership', event.target.value);
    };

    const handleFilterSubtripType = (event) => {
        onFilters('subtripType', event.target.value);
    };

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
                        <TextField
                            fullWidth
                            value={filters.subtripNo}
                            onChange={handleFilterSubtripId}
                            placeholder="Job ID"
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
                            value={filters.referenceSubtripNo}
                            onChange={handleFilterReferenceSubtripNo}
                            placeholder="Refference Job No"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <DialogSelectButton
                            onClick={transporterDialog.onTrue}
                            selected={selectedTransporter?.transportName}
                            placeholder="Transporter"
                            iconName="mdi:truck-delivery"
                        />

                        <DialogSelectButton
                            onClick={customerDialog.onTrue}
                            selected={selectedCustomer?.customerName}
                            placeholder="Customer"
                            iconName="mdi:office-building"
                        />

                        <DialogSelectButton
                            onClick={vehicleDialog.onTrue}
                            selected={selectedVehicle?.vehicleNo}
                            placeholder="Vehicle"
                            iconName="mdi:truck"
                        />

                        <DialogSelectButton
                            onClick={driverDialog.onTrue}
                            selected={selectedDriver?.driverName}
                            placeholder="Driver"
                            iconName="mdi:account"
                        />

                        <DialogSelectButton
                            onClick={startRange.onTrue}
                            selected={
                                filters.fromDate && filters.toDate
                                    ? fDateRangeShortLabel(filters.fromDate, filters.toDate)
                                    : undefined
                            }
                            placeholder="Dispatch Date Range"
                            iconName="mdi:calendar"
                        />

                        <DialogSelectButton
                            onClick={endRange.onTrue}
                            selected={
                                filters.subtripEndFromDate && filters.subtripEndToDate
                                    ? fDateRangeShortLabel(filters.subtripEndFromDate, filters.subtripEndToDate)
                                    : undefined
                            }
                            placeholder="Receive Date Range"
                            iconName="mdi:calendar"
                        />

                        <DialogSelectButton
                            onClick={materialPopover.onOpen}
                            selected={
                                filters.materials.length > 0 ? `${filters.materials.length} materials` : undefined
                            }
                            placeholder="Materials"
                            iconName="mdi:filter-variant"
                        />

                        <FormControl fullWidth>
                            <InputLabel id="subtrip-vehicle-ownership-select-label">
                                Vehicle Ownership
                            </InputLabel>
                            <Select
                                value={filters.vehicleOwnership || ''}
                                onChange={handleFilterVehicleOwnership}
                                input={<OutlinedInput label="Vehicle Ownership" />}
                                labelId="subtrip-vehicle-ownership-select-label"
                                MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <Divider sx={{ borderStyle: 'dashed' }} />
                                <MenuItem value="Market">Market</MenuItem>
                                <MenuItem value="Own">Own</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="subtrip-type-select-label">Subtrip Type</InputLabel>
                            <Select
                                value={filters.subtripType || ''}
                                onChange={handleFilterSubtripType}
                                input={<OutlinedInput label="Subtrip Type" />}
                                labelId="subtrip-type-select-label"
                                MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <Divider sx={{ borderStyle: 'dashed' }} />
                                <MenuItem value="Empty">Empty</MenuItem>
                                <MenuItem value="Loaded">Loaded</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Scrollbar>
            </Drawer>

            <CustomPopover
                open={materialPopover.open}
                onClose={materialPopover.onClose}
                anchorEl={materialPopover.anchorEl}
                slotProps={{ arrow: { placement: 'right-top' } }}
            >
                <Scrollbar sx={{ width: 200, maxHeight: 400 }}>
                    <MenuList>
                        {materialOptions.map(({ value }) => (
                            <MenuItem key={value} onClick={() => handleToggleMaterial(value)}>
                                <Checkbox checked={filters.materials.includes(value)} />
                                <ListItemText primary={value} />
                            </MenuItem>
                        ))}
                    </MenuList>
                </Scrollbar>
            </CustomPopover>

            <CustomDateRangePicker
                variant="calendar"
                open={startRange.value}
                onClose={startRange.onFalse}
                startDate={filters.fromDate}
                endDate={filters.toDate}
                onChangeStartDate={(date) => onFilters('fromDate', date)}
                onChangeEndDate={(date) => onFilters('toDate', date)}
            />

            <CustomDateRangePicker
                variant="calendar"
                open={endRange.value}
                onClose={endRange.onFalse}
                startDate={filters.subtripEndFromDate}
                endDate={filters.subtripEndToDate}
                onChangeStartDate={(date) => onFilters('subtripEndFromDate', date)}
                onChangeEndDate={(date) => onFilters('subtripEndToDate', date)}
            />
        </>
    );
}
