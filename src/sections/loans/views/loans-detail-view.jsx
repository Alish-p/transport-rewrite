import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import LoansToolbar from '../loans-toolbar';
import LoansPreview from '../loans-preview';

export function LoanDetailView({ loan }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Loan's Detail"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Loans', href: paths.dashboard.loan.root },
          { name: loan?._id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <LoansToolbar loan={loan} />

      <LoansPreview loan={loan} />
    </DashboardContent>
  );
}
