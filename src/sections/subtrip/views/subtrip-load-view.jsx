import { useNavigate } from 'react-router-dom';

import { Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function SubtripLoadView() {
  const navigate = useNavigate();
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Load Job"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Job List', href: paths.dashboard.subtrip.list },
          { name: 'Load Job' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          Loading flow has been merged into the unified Job Create experience.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(paths.dashboard.subtrip.jobCreate)}
          sx={{ alignSelf: 'flex-start' }}
        >
          Go to Create Job
        </Button>
      </Stack>
    </DashboardContent>
  );
}
