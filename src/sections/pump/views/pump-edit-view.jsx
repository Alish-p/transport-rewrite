import { paths } from 'src/routes/paths';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import PumpForm from '../pump-form';
import { DashboardContent } from 'src/layouts/dashboard';

export function PumpEditView({ pump }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Pump"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Pump List',
            href: paths.dashboard.pump.list,
          },
          { name: pump?.pumpName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PumpForm isEdit currentPump={pump} />
    </DashboardContent>
  );
}
