import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetTyre } from 'src/query/use-tyre';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { HeroHeader } from 'src/components/hero-header-card';
import { LoadingScreen } from 'src/components/loading-screen';

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

    const [openThreadDialog, setOpenThreadDialog] = useState(false);

    if (isLoading) return <LoadingScreen />;

    if (error) return <div>Error loading tyre details</div>;
    if (!tyre) return <div>Tyre not found</div>;

    return (
        <DashboardContent>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <HeroHeader
                    title={`${tyre.brand} ${tyre.model}`}
                    status={tyre.status}
                    icon="mdi:tire"
                    meta={[
                        { icon: 'solar:code-file-bold', label: tyre.serialNumber },
                        { icon: 'solar:ruler-angular-bold', label: tyre.size },
                    ]}
                    actions={[
                        {
                            label: 'Edit',
                            icon: 'solar:pen-bold',
                            onClick: () => navigate(paths.dashboard.tyre.edit(tyre._id)),
                        },
                        {
                            label: 'Change Thread Depth',
                            icon: 'mdi:ruler',
                            onClick: () => setOpenThreadDialog(true),
                        }
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

                    <Grid item xs={12}>
                        <TyreHistory />
                    </Grid>
                </Grid>

                <TyreThreadUpdateDialog
                    open={openThreadDialog}
                    onClose={() => setOpenThreadDialog(false)}
                    tyreId={tyre._id}
                    currentDepth={tyre?.threadDepth?.current}
                />
            </Container>
        </DashboardContent>
    );
}
