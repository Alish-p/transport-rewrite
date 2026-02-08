import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CircularProgress from '@mui/material/CircularProgress';

import { useUpdateVehicle, useGetTyreLayouts } from 'src/query/use-vehicle';

import { TyreLayoutDiagram } from '../components/tyre-layout-diagram';

// ----------------------------------------------------------------------

export function VehicleTyreLayoutSelect({ vehicle }) {
    const { data: layoutsData, isLoading } = useGetTyreLayouts();
    const updateVehicle = useUpdateVehicle();

    const [selectedLayoutId, setSelectedLayoutId] = useState(null);

    const handleSave = async () => {
        try {
            await updateVehicle({
                id: vehicle._id,
                data: { tyreLayoutId: selectedLayoutId }
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    const layouts = layoutsData?.data || [];

    return (
        <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Select Tyre Layout</Typography>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!selectedLayoutId}
                >
                    Save Layout
                </Button>
            </Stack>

            <Grid container spacing={3}>
                {layouts.map((layout) => {
                    const isSelected = selectedLayoutId === layout.id;
                    return (
                        <Grid xs={12} sm={6} md={4} key={layout.id}>
                            <Card
                                sx={{
                                    border: (theme) => isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
                                    bgcolor: (theme) => isSelected ? theme.palette.action.selected : 'background.paper'
                                }}
                            >
                                <CardActionArea
                                    onClick={() => setSelectedLayoutId(layout.id)}
                                    sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                >
                                    <TyreLayoutDiagram positions={layout.tyres} />
                                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                                        {layout.name}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Stack>
    );
}
