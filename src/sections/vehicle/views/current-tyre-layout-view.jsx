import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Unstable_Grid2';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetTyreLayouts } from 'src/query/use-vehicle';
import { useGetTyres, useMountTyre, useUnmountTyre } from 'src/query/use-tyre';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';

import { KanbanTyreDialog } from '../components/kanban-tyre-dialog';
import { TyreLayoutDiagram } from '../components/tyre-layout-diagram';
import TyreUnmountDialog from '../../tyre/components/tyre-unmount-dialog';

// ----------------------------------------------------------------------

export function CurrentTyreLayoutView({ vehicle }) {
    const { data: layoutsData, isLoading: isLoadingLayouts } = useGetTyreLayouts();

    // Fetch mounted tyres for this vehicle
    const { data: tyresData, isLoading: isLoadingTyres } = useGetTyres(
        { vehicleId: vehicle?._id, status: 'Mounted', limit: 100 },
        { enabled: !!vehicle?._id }
    );

    const { mutate: mountTyre } = useMountTyre();
    const { mutate: unmountTyre } = useUnmountTyre();

    const [mountDialogOpen, setMountDialogOpen] = useState(false);
    const [unmountDialogOpen, setUnmountDialogOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [selectedTyreToUnmount, setSelectedTyreToUnmount] = useState(null);

    const currentLayout = useMemo(() => {
        if (!layoutsData?.data || !vehicle?.tyreLayoutId) return null;
        return layoutsData.data.find(l => l.id === vehicle.tyreLayoutId);
    }, [layoutsData, vehicle]);

    // Create a map of position -> tyre
    const tyreMap = useMemo(() => {
        const map = {};
        if (tyresData?.tyres) {
            tyresData.tyres.forEach(t => {
                if (t.currentPosition) {
                    map[t.currentPosition] = t;
                }
            });
        }
        return map;
    }, [tyresData]);

    const handleTyreClick = (position) => {
        const mountedTyre = tyreMap[position];
        setSelectedPosition(position);

        if (mountedTyre) {
            setSelectedTyreToUnmount(mountedTyre);
            setUnmountDialogOpen(true);
        } else {
            setSelectedTyreToUnmount(null);
            setMountDialogOpen(true);
        }
    };

    const handleMountTyre = (tyre, odometer) => {
        if (!selectedPosition || !vehicle?._id) return;

        mountTyre({
            id: tyre._id,
            data: {
                position: selectedPosition,
                vehicleId: vehicle._id,
                odometer // Use the odometer from the dialog
            }
        });
    };

    const handleUnmountTyre = (data) => {
        if (!selectedTyreToUnmount) return;

        unmountTyre({
            id: selectedTyreToUnmount._id,
            data: {
                ...data,
                vehicleId: vehicle._id
            }
        }, {
            onSuccess: () => {
                setUnmountDialogOpen(false);
                setSelectedTyreToUnmount(null);
            }
        });
    };

    if (isLoadingLayouts || isLoadingTyres) {
        return <CircularProgress />;
    }

    if (!currentLayout) {
        return <Typography>Layout not found</Typography>;
    }

    return (
        <Grid container spacing={3}>
            <Grid xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                    <CardHeader title="Current Layout" />
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>{currentLayout.name}</Typography>
                        <TyreLayoutDiagram
                            positions={currentLayout.tyres}
                            tyreMap={tyreMap}
                            onSelect={handleTyreClick}
                        />
                    </CardContent>
                </Card>
            </Grid>

            <Grid xs={12} md={8}>
                <Card sx={{ height: '100%' }}>
                    <CardHeader title="Mounted Tyres" subheader={`${Object.keys(tyreMap).length} tyres mounted`} sx={{ mb: 2 }} />
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Scrollbar>
                            <Table sx={{ minWidth: 640 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Position</TableCell>
                                        <TableCell>Tyre ID</TableCell>
                                        <TableCell>Brand</TableCell>
                                        <TableCell>Model</TableCell>
                                        <TableCell>Current Km</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tyresData?.tyres?.map((tyre) => (
                                        <TableRow key={tyre._id}>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{tyre.currentPosition}</TableCell>
                                            <TableCell>
                                                <Link
                                                    component={RouterLink}
                                                    to={paths.dashboard.tyre.details(tyre._id)}
                                                    variant="body2"
                                                    noWrap
                                                    sx={{ color: 'primary', cursor: 'pointer' }}
                                                >
                                                    {tyre.serialNumber}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{tyre.brand}</TableCell>
                                            <TableCell>{tyre.model}</TableCell>
                                            <TableCell>{tyre.totalMileage}</TableCell>
                                            <TableCell>
                                                <Label color="success">Mounted</Label>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!tyresData?.tyres || tyresData.tyres.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                                                No tyres mounted
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                </Card>
            </Grid>

            <KanbanTyreDialog
                open={mountDialogOpen}
                onClose={() => setMountDialogOpen(false)}
                onTyreSelect={handleMountTyre}
            />

            <TyreUnmountDialog
                open={unmountDialogOpen}
                onClose={() => setUnmountDialogOpen(false)}
                onUnmount={handleUnmountTyre}
                vehicleName={vehicle?.vehicleNo}
            />
        </Grid>
    );
}
