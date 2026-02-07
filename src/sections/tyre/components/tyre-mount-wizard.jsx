import { useState, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useDebounce } from 'src/hooks/use-debounce';
import { useVehicle, useInfiniteVehicles, useGetTyreLayouts } from 'src/query/use-vehicle';
import { TyreLayoutDiagram } from 'src/sections/vehicle/components/tyre-layout-diagram';

const steps = ['Select Vehicle & Odometer', 'Select Position'];

export default function TyreMountWizard({ open, onClose, onMount }) {
    const [activeStep, setActiveStep] = useState(0);

    // Step 1 State
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [odometer, setOdometer] = useState('');
    const [vehicleSearch, setVehicleSearch] = useState('');

    // Step 2 State
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [currentLayoutPositions, setCurrentLayoutPositions] = useState([]);

    // Data Fetching for Step 1 (Vehicles)
    const debouncedSearch = useDebounce(vehicleSearch, 300);
    const { data: vehiclesData, isLoading: isLoadingVehicles } = useInfiniteVehicles(
        { vehicleNo: debouncedSearch, rowsPerPage: 20, isOwn: true },
        { enabled: open }
    );

    const vehicleOptions = useMemo(
        () => vehiclesData?.pages.flatMap((page) => page.results) || [],
        [vehiclesData]
    );

    // Data Fetching for Step 2 (Layouts & Selected Vehicle Details)
    const { data: vehicleDetails } = useVehicle(selectedVehicle?._id);
    const { data: layoutsData } = useGetTyreLayouts();
    const layouts = layoutsData?.data || [];

    // Reset state when closing
    useEffect(() => {
        if (!open) {
            setActiveStep(0);
            setSelectedVehicle(null);
            setOdometer('');
            setVehicleSearch('');
            setSelectedPosition(null);
            setCurrentLayoutPositions([]);
        }
    }, [open]);

    // Load layout when moving to step 2
    useEffect(() => {
        if (activeStep === 1 && vehicleDetails && layouts.length > 0) {
            const layout = layouts.find((l) => l.id === vehicleDetails.tyreLayoutId);
            if (layout?.tyres) {
                setCurrentLayoutPositions(layout.tyres);
            } else {
                setCurrentLayoutPositions([]);
            }
        }
    }, [activeStep, vehicleDetails, layouts]);

    const handleNext = () => {
        if (activeStep === 0) {
            // Validate Step 1
            if (!selectedVehicle || !odometer) return;
            setActiveStep(1);
        } else {
            // Submit
            onMount({
                vehicleId: selectedVehicle._id,
                odometer: Number(odometer),
                position: selectedPosition,
            });
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const isStep1Valid = selectedVehicle && odometer;
    const isStep2Valid = selectedPosition;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Mount Tyre</DialogTitle>

            <Box sx={{ width: '100%', mb: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <DialogContent sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
                {activeStep === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                        <Autocomplete
                            fullWidth
                            options={vehicleOptions}
                            getOptionLabel={(option) => option.vehicleNo}
                            loading={isLoadingVehicles}
                            value={selectedVehicle}
                            onChange={(_, newValue) => setSelectedVehicle(newValue)}
                            onInputChange={(_, newInputValue) => setVehicleSearch(newInputValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Vehicle"
                                    placeholder="Search by vehicle number..."
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {isLoadingVehicles ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props} key={option._id}>
                                    {option.vehicleNo}
                                    <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                                        ({option.vehicleType})
                                    </Typography>
                                </li>
                            )}
                        />

                        <TextField
                            label="Odometer Reading"
                            type="number"
                            fullWidth
                            value={odometer}
                            onChange={(e) => setOdometer(e.target.value)}
                            helperText="Enter current odometer reading"
                        />
                    </Box>
                )}

                {activeStep === 1 && (
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            Select Position on {selectedVehicle?.vehicleNo}
                        </Typography>

                        {currentLayoutPositions.length > 0 ? (
                            <TyreLayoutDiagram
                                positions={currentLayoutPositions}
                                selectedPosition={selectedPosition}
                                onSelect={setSelectedPosition}
                            />
                        ) : (
                            <Box sx={{ py: 5, textAlign: 'center' }}>
                                <Typography color="error">
                                    No tyre layout configured for this vehicle.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                {activeStep > 0 && (
                    <Button onClick={handleBack} color="inherit" sx={{ mr: 1 }}>
                        Back
                    </Button>
                )}
                <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={activeStep === 0 ? !isStep1Valid : !isStep2Valid}
                >
                    {activeStep === steps.length - 1 ? 'Mount' : 'Next'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
