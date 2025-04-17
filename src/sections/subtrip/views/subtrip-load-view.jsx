import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SubtripLoadForm } from '../subtrip-load-form';

export function SubtripLoadView({ currentSubtrip }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={currentSubtrip ? `Load Subtrip ${currentSubtrip._id}` : 'Load Subtrip'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Subtrip List', href: paths.dashboard.subtrip.list },
          { name: 'Load Subtrip' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SubtripLoadForm currentSubtrip={currentSubtrip} />
    </DashboardContent>
  );
}
