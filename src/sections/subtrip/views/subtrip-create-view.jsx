import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import SubtripCreateForm from '../subtrip-create-form';

export function SubtripCreateView({ tripList, currentTrip }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={
          currentTrip !== 'undefined' ? `Add New Subtrip to ${currentTrip}` : 'Create New Subtrip'
        }
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Subtrip List', href: paths.dashboard.subtrip.list },
          { name: 'Add New Subtrip' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SubtripCreateForm currentTrip={currentTrip !== 'undefined' ? currentTrip : null} />
    </DashboardContent>
  );
}
