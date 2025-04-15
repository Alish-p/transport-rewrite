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

      <SubtripReceiveForm currentSubtrip={currentSubtrip} />
    </DashboardContent>
  );
}
