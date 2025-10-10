import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import SubtripCreateForm from '../subtrip-create-form';

export function SubtripCreateView({ currentTrip }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={currentTrip ? `Add New Job to Existing Trip` : 'Create New Job'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Job List', href: paths.dashboard.subtrip.list },
          { name: 'Add New Job' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SubtripCreateForm currentTrip={currentTrip !== 'undefined' ? currentTrip : null} />
    </DashboardContent>
  );
}
