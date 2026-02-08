import { toast } from 'sonner';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { useVehicle, useGetTyreLayouts } from 'src/query/use-vehicle';
import { useGetTyre, useMountTyre, useScrapTyre, useUnmountTyre } from 'src/query/use-tyre';

import { useSettingsContext } from 'src/components/settings';
import { HeroHeader } from 'src/components/hero-header-card';
import { LoadingScreen } from 'src/components/loading-screen';

import { TyreLayoutDiagram } from 'src/sections/vehicle/components/tyre-layout-diagram';

import TyreHistory from './tyre-history-widget';
import { TYRE_STATUS } from '../tyre-constants';
import TyreGeneralInfo from './tyre-general-info';
import { Iconify } from '../../../components/iconify';
import OverviewWidget from '../components/overview-widget';
import TyreMountWizard from '../components/tyre-mount-wizard';
import TyreScrapDialog from '../components/tyre-scrap-dialog';
import TyreRemoldDialog from '../components/tyre-remold-dialog';
import TyreUnmountDialog from '../components/tyre-unmount-dialog';
import TyreThreadUpdateDialog from '../components/tyre-thread-update-dialog';

// ----------------------------------------------------------------------

export default function TyreDetailsView() {
    const settings = useSettingsContext();
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: tyre, isLoading, error } = useGetTyre(id);
    const { mutateAsync: mountTyre } = useMountTyre();
    const { mutateAsync: unmountTyre } = useUnmountTyre();
    const { mutateAsync: scrapTyre } = useScrapTyre();

    const [openThreadDialog, setOpenThreadDialog] = useState(false);
    const [openMountWizard, setOpenMountWizard] = useState(false);
    const [openUnmountDialog, setOpenUnmountDialog] = useState(false);
    const [openScrapDialog, setOpenScrapDialog] = useState(false);
    const [openRemoldDialog, setOpenRemoldDialog] = useState(false);

    // Fetch current vehicle details if mounted (for display in Info and Unmount dialog)
    const { data: currentVehicle } = useVehicle(tyre?.currentVehicleId);

    // For layout display on details page
    const { data: layoutsData } = useGetTyreLayouts();
    const layouts = layoutsData?.data || [];
    const currentMountingLayout = layouts.find(l => l.id === currentVehicle?.tyreLayoutId);
    const mountingPositions = currentMountingLayout?.tyres || [];

    const handleMount = async ({ vehicleId, position, odometer }) => {
        try {
            await mountTyre({
                id: tyre._id,
                data: {
                    vehicleId,
                    position,
                    odometer,
                    mountDate: new Date()
                }
            });
            toast.success(`Tyre mounted successfully`);
            setOpenMountWizard(false);
        } catch (e) {
            console.error(e);
            toast.error(e?.message || 'Failed to mount tyre');
        }
    };

    const handleUnmount = async ({ odometer }) => {
        try {
            await unmountTyre({
                id: tyre._id,
                data: {
                    odometer,
                    unmountDate: new Date()
                }
            });
            toast.success('Tyre unmounted successfully');
            setOpenUnmountDialog(false);
        } catch (e) {
            console.error(e);
            toast.error(e?.message || 'Failed to unmount tyre');
        }
    };

    const handleScrap = async ({ odometer, scrapDate }) => {
        try {
            await scrapTyre({
                id: tyre._id,
                data: {
                    odometer,
                    scrapDate
                }
            });
            toast.success('Tyre moved to scrap successfully');
            setOpenScrapDialog(false);
        } catch (e) {
            console.error(e);
            toast.error(e?.message || 'Failed to scrap tyre');
        }
    };

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
                                    disabled: tyre.status === TYRE_STATUS.SCRAPPED,
                                },
                                {
                                    label: 'Mount',
                                    icon: 'mingcute:tyre-line',
                                    onClick: () => setOpenMountWizard(true),
                                    disabled: tyre.status === TYRE_STATUS.MOUNTED || tyre.status === TYRE_STATUS.SCRAPPED,
                                },
                                {
                                    label: 'Unmount',
                                    icon: 'gg:remove',
                                    onClick: () => setOpenUnmountDialog(true),
                                    disabled: tyre.status !== TYRE_STATUS.MOUNTED,
                                },
                                {
                                    label: 'Move to Scrap',
                                    icon: 'tabler:trash-filled',
                                    onClick: () => setOpenScrapDialog(true),
                                    disabled: tyre.status === TYRE_STATUS.SCRAPPED,
                                    sx: { color: 'error.main' },
                                },
                                {
                                    label: 'Remold',
                                    icon: 'solar:refresh-circle-bold',
                                    onClick: () => setOpenRemoldDialog(true),
                                    disabled: tyre.status !== TYRE_STATUS.IN_STOCK,
                                },
                            ],
                        },
                    ]}
                />

                <Grid container spacing={3} mt={3}>
                    {/* <Grid item xs={12} md={4}>
                        <TyreThreadWidget
                            title="Thread Depth"
                            current={tyre?.threadDepth?.current || 0}
                            original={tyre?.threadDepth?.original || 0}
                        />
                    </Grid> */}
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <OverviewWidget
                                    title="Total Distance"
                                    total={tyre.currentKm || 0}
                                    icon="mingcute:road-line"
                                    color="info"
                                    unit="km"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <OverviewWidget
                                    title="Remaining Thread"
                                    total={`${tyre?.threadDepth?.current || 0}/${tyre?.threadDepth?.original || 0}`}
                                    icon="mingcute:ruler-line"
                                    color="warning"
                                    unit="mm"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TyreGeneralInfo tyre={tyre} />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardHeader
                                title="Mounting Position"
                                subheader={
                                    tyre.status === TYRE_STATUS.MOUNTED ? (
                                        <Box component="span">
                                            <Link
                                                component={RouterLink}
                                                href={paths.dashboard.vehicle.details(currentVehicle?._id)}
                                                color="primary"
                                                variant="subtitle2"
                                            >
                                                {currentVehicle?.vehicleNo}
                                            </Link>
                                            {' - '}
                                            <Box component="span" sx={{ color: 'text.secondary' }}>
                                                {tyre.currentPosition}
                                            </Box>
                                        </Box>
                                    ) : (
                                        'Not Mountd'
                                    )
                                }
                            />
                            <CardContent>
                                {tyre.status === TYRE_STATUS.MOUNTED && mountingPositions.length > 0 ? (
                                    <TyreLayoutDiagram
                                        positions={mountingPositions}
                                        selectedPosition={tyre.currentPosition}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 200,
                                            color: 'primary.main',
                                        }}
                                    >
                                        <Iconify icon="mingcute:tyre-line" sx={{ mr: 2 }} />
                                        <Typography variant="h6">
                                            {tyre.status === TYRE_STATUS.IN_STOCK ? 'In Stock' : 'Currently Not Mounted'}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <TyreHistory tyreId={tyre._id} />
                    </Grid>
                </Grid>

                <TyreThreadUpdateDialog
                    open={openThreadDialog}
                    onClose={() => setOpenThreadDialog(false)}
                    tyreId={tyre._id}
                    currentDepth={tyre?.threadDepth?.current}
                />

                <TyreMountWizard
                    open={openMountWizard}
                    onClose={() => setOpenMountWizard(false)}
                    onMount={handleMount}
                />

                <TyreUnmountDialog
                    open={openUnmountDialog}
                    onClose={() => setOpenUnmountDialog(false)}
                    onUnmount={handleUnmount}
                    vehicleName={currentVehicle?.vehicleNo}
                />

                <TyreScrapDialog
                    open={openScrapDialog}
                    onClose={() => setOpenScrapDialog(false)}
                    onScrap={handleScrap}
                    currentStatus={tyre.status}
                />

                <TyreRemoldDialog
                    open={openRemoldDialog}
                    onClose={() => setOpenRemoldDialog(false)}
                    tyreId={tyre._id}
                    currentDepth={tyre?.threadDepth?.current}
                />

            </Container>
        </DashboardContent>
    );
}
