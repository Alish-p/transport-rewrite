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

                    <TextField
                        fullWidth
                        value={filters.vehicleCount === -1 ? '' : filters.vehicleCount}
                        onChange={(event) => {
                            const { value } = event.target;
                            onFilters('vehicleCount', value === '' ? -1 : Number(value));
                        }}
                        placeholder="No. of Vehicles"
                        type="number"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="mdi:truck" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

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
