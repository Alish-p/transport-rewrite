import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetTyre, useMountTyre } from 'src/query/use-tyre';
import { useVehicle, useGetTyreLayouts } from 'src/query/use-vehicle';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { HeroHeader } from 'src/components/hero-header-card';
import { LoadingScreen } from 'src/components/loading-screen';

import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';
import { TyreLayoutDiagram } from 'src/sections/vehicle/components/tyre-layout-diagram';

import TyreHistory from './tyre-history-widget';
import TyreGeneralInfo from './tyre-general-info';
import TyreThreadWidget from './tyre-thread-widget';
import TyreThreadUpdateDialog from '../components/tyre-thread-update-dialog';

// ----------------------------------------------------------------------

export default function TyreDetailsView() {
    const settings = useSettingsContext();
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: tyre, isLoading, error } = useGetTyre(id);
    const { mutateAsync: mountTyre } = useMountTyre();

    const [openThreadDialog, setOpenThreadDialog] = useState(false);

    // Mount Flow State
    const [openVehicleDialog, setOpenVehicleDialog] = useState(false);
    const [openLayoutDialog, setOpenLayoutDialog] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [currentLayoutPositions, setCurrentLayoutPositions] = useState([]);

    // Fetch full vehicle details when a vehicle is selected
    const { data: vehicle, isLoading: isLoadingVehicle } = useVehicle(selectedVehicleId);

    // Fetch all layouts to lookup the vehicle's layout
    const { data: layoutsData } = useGetTyreLayouts();
    const layouts = layoutsData?.data || [];

    // Watch for vehicle data loading to trigger layout check
    useEffect(() => {
        if (selectedVehicleId && !isLoadingVehicle && vehicle) {
            if (vehicle.tyreLayoutId) {
                const layout = layouts.find(l => l.id === vehicle.tyreLayoutId);

                if (layout && layout.tyres && layout.tyres.length > 0) {
                    setCurrentLayoutPositions(layout.tyres);
                    setOpenLayoutDialog(true);
                } else {
                    toast.error('Selected vehicle has an invalid or missing layout configuration');
                    setSelectedVehicleId(null);
                }
            } else {
                toast.error('Please first select vehicle layout and then come here');
                setSelectedVehicleId(null);
            }
        }
    }, [selectedVehicleId, isLoadingVehicle, vehicle, layouts]);

    const handleMountClick = () => {
        setOpenVehicleDialog(true);
        setSelectedVehicleId(null);
        setSelectedPosition(null);
        setCurrentLayoutPositions([]);
    };

    const handleVehicleSelect = (selected) => {
        // Just set the ID, the effect will handle the validation and next step
        setSelectedVehicleId(selected._id);
        // Do not close vehicle dialog immediately if you want a loading state transition?
        // Actually, better to close vehicle dialog and show a loading spinner or just wait for the Layout Dialog to pop.
        // Or keep a "Loading Layout..." state?
        // For simplicity:
        setOpenVehicleDialog(false);
    };

    const handleConfirmMount = async () => {
        if (!selectedPosition) return;

        try {
            await mountTyre({
                id: tyre._id,
                data: {
                    vehicleId: selectedVehicleId,
                    position: selectedPosition,
                    mountDate: new Date() // You might want to allow user to pick date, using now for simplicity
                }
            });
            toast.success(`Tyre mounted to ${selectedPosition} successfully`);
            setOpenLayoutDialog(false);
            setSelectedVehicleId(null);
            setSelectedPosition(null);
        } catch (error) {
            console.error(error);
            toast.error(error?.message || 'Failed to mount tyre');
        }
    };

    // Fetch current vehicle details if mounted
    const { data: currentVehicle } = useVehicle(tyre?.currentVehicleId);

    const currentMountingLayout = layouts.find(l => l.id === currentVehicle?.tyreLayoutId);
    const mountingPositions = currentMountingLayout?.tyres || [];

    if (isLoading) return <LoadingScreen />;

    if (error) return <div>Error loading tyre details</div>;
    if (!tyre) return <div>Tyre not found</div>;

    const meta = [
        { icon: 'solar:code-file-bold', label: tyre.serialNumber },
        { icon: 'solar:ruler-angular-bold', label: tyre.size },
    ];

    return (
        <DashboardContent>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <HeroHeader
                    title={`${tyre.brand} ${tyre.serialNumber}`}
                    status={tyre.status}
                    icon="mingcute:tyre-line"
                    meta={meta}
                    actions={[
                        {
                            label: 'Edit',
                            icon: 'solar:pen-bold',
                            onClick: () => navigate(paths.dashboard.tyre.edit(tyre._id)),
                        },
                    ]}
                    menus={[
                        {
                            label: 'Actions',
                            icon: 'eva:settings-2-fill',
                            items: [
                                {
                                    label: 'Change Thread',
                                    icon: 'mdi:ruler',
                                    onClick: () => setOpenThreadDialog(true),
                                },
                                {
                                    label: 'Mount',
                                    icon: 'mingcute:tyre-line',
                                    onClick: handleMountClick,
                                },
                                {
                                    label: 'Unmount',
                                    icon: 'gg:remove',
                                    onClick: () => console.info('Unmount'),
                                },
                                {
                                    label: 'Remold',
                                    icon: 'mdi:refresh',
                                    onClick: () => console.info('Remold'),
                                },
                            ],
                        },
                    ]}
                />

                <Grid container spacing={3} mt={3}>
                    <Grid item xs={12} md={4}>
                        <TyreThreadWidget
                            title="Thread Depth"
                            current={tyre?.threadDepth?.current || 0}
                            original={tyre?.threadDepth?.original || 0}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <TyreGeneralInfo tyre={tyre} />
                    </Grid>

                    {tyre.status === 'Mounted' && mountingPositions.length > 0 && (
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardHeader
                                    title="Mounting Position"
                                    subheader={
                                        <Link
                                            component={RouterLink}
                                            href={paths.dashboard.vehicle.details(currentVehicle?._id)}
                                            color="primary"
                                            variant="subtitle2"
                                        >
                                            {currentVehicle?.vehicleNo}
                                        </Link>
                                    }
                                />
                                <CardContent>
                                    <TyreLayoutDiagram
                                        positions={mountingPositions}
                                        selectedPosition={tyre.currentPosition}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    <Grid item xs={12} md={tyre.status === 'Mounted' ? 8 : 12}>
                        <TyreHistory />
                    </Grid>
                </Grid>

                <TyreThreadUpdateDialog
                    open={openThreadDialog}
                    onClose={() => setOpenThreadDialog(false)}
                    tyreId={tyre._id}
                    currentDepth={tyre?.threadDepth?.current}
                />

                {/* Step 1: Vehicle Selection */}
                <KanbanVehicleDialog
                    open={openVehicleDialog}
                    onClose={() => setOpenVehicleDialog(false)}
                    onVehicleChange={handleVehicleSelect}
                    onlyOwn
                />

                {/* Step 2: Layout Diagram Selection */}
                <Dialog
                    open={openLayoutDialog}
                    onClose={() => setOpenLayoutDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Select Tyre Position</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                Select the position where checking <b>{tyre.serialNumber}</b> will be mounted on <b>{vehicle?.vehicleNo}</b>
                            </Typography>

                            {currentLayoutPositions.length > 0 && (
                                <TyreLayoutDiagram
                                    positions={currentLayoutPositions}
                                    selectedPosition={selectedPosition}
                                    onSelect={setSelectedPosition}
                                />
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenLayoutDialog(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            disabled={!selectedPosition}
                            onClick={handleConfirmMount}
                        >
                            Mount
                        </Button>
                    </DialogActions>
                </Dialog>

            </Container>
        </DashboardContent>
    );
}
