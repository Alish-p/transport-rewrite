import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
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

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { STATES } from '../customer/config';

// ----------------------------------------------------------------------

export default function TransporterFiltersDrawer({
    open,
    onClose,
    filters,
    onFilters,
    vehicleDialog,
    selectedVehicle,
}) {

    const handleFilterState = (event) => {
        onFilters('state', event.target.value);
    };

    const handleFilterPaymentMode = (event) => {
        onFilters('paymentMode', event.target.value);
    };

    const handleFilterGstEnabled = (event) => {
        onFilters('gstEnabled', event.target.value);
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
                        value={filters.search}
                        onChange={(e) => onFilters('search', e.target.value)}
                        placeholder="Name or Mobile No."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Box sx={{ px: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                            <Iconify icon="mdi:truck" sx={{ color: 'text.disabled', width: 18, height: 18 }} />
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                Vehicles: {filters.vehicleCountMin || 0} – {filters.vehicleCountMax || '50+'}
                            </Typography>
                        </Stack>
                        <Slider
                            value={[
                                filters.vehicleCountMin ? Number(filters.vehicleCountMin) : 0,
                                filters.vehicleCountMax ? Number(filters.vehicleCountMax) : 50,
                            ]}
                            onChange={(event, newValue) => {
                                onFilters('vehicleCountMin', newValue[0] === 0 ? '' : String(newValue[0]));
                                onFilters('vehicleCountMax', newValue[1] === 50 ? '' : String(newValue[1]));
                            }}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => (value === 50 ? '50+' : value)}
                            min={0}
                            max={50}
                            size="small"
                            disableSwap
                        />
                    </Box>

                    <DialogSelectButton
                        onClick={vehicleDialog.onTrue}
                        selected={selectedVehicle?.vehicleNo}
                        placeholder="Vehicle"
                        iconName="mdi:truck"
                    />

                    <TextField
                        fullWidth
                        value={filters.gstNo}
                        onChange={(e) => onFilters('gstNo', e.target.value)}
                        placeholder="GST Number"
                    />

                    <TextField
                        fullWidth
                        value={filters.panNo}
                        onChange={(e) => onFilters('panNo', e.target.value)}
                        placeholder="PAN Number"
                    />

                    <FormControl fullWidth>
                        <InputLabel id="transporter-state-select-label">State</InputLabel>
                        <Select
                            value={filters.state || ''}
                            onChange={handleFilterState}
                            input={<OutlinedInput label="State" />}
                            labelId="transporter-state-select-label"
                            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
                        >
                            <MenuItem value="">All</MenuItem>
                            <Divider sx={{ borderStyle: 'dashed' }} />
                            {STATES.map((state) => (
                                <MenuItem key={state.value} value={state.value}>
                                    {state.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Payment Mode"
                        placeholder="Cash, UPI, NEFT, Cheque"
                        value={filters.paymentMode}
                        onChange={handleFilterPaymentMode}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="transporter-gst-status-label">GST Status</InputLabel>
                        <Select
                            value={filters.gstEnabled}
                            onChange={handleFilterGstEnabled}
                            input={<OutlinedInput label="GST Status" />}
                            labelId="transporter-gst-status-label"
                            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <Divider sx={{ borderStyle: 'dashed' }} />
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                        </Select>
                    </FormControl>

                </Stack>
            </Scrollbar>
        </Drawer>
    );
}
