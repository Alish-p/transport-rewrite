import { Box, Card, Grid, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SubtripReceiveForm } from '../subtrip-receive-form';

export function SubtripReceiveView({ currentSubtrip }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={currentSubtrip ? `Receive Subtrip ${currentSubtrip._id}` : 'Receive Subtrip'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Subtrip List', href: paths.dashboard.subtrip.list },
          { name: 'Receive Subtrip' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Grid container spacing={3} sx={{ pt: 10 }}>
        <Grid item xs={12} md={3}>
          <Box sx={{ pt: 2, pb: 5, px: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Receive Subtrip
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 1 }}>
              Please provide the details of the subtrip.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <SubtripReceiveForm currentSubtrip={currentSubtrip} />
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
