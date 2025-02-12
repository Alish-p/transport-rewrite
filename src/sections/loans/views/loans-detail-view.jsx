import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { paths } from 'src/routes/paths';

import { fetchLoan } from 'src/redux/slices/loan';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import LoansToolbar from '../loans-toolbar';
import LoansPreview from '../loans-preview';

export function LoanDetailView() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loan, isLoading } = useSelector((state) => state.loan);

  useEffect(() => {
    dispatch(fetchLoan(id));
  }, [dispatch, id]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Loan's Detail"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Loans', href: paths.dashboard.loan.root },
          { name: id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loan && <LoansToolbar loan={loan} />}

      {loan && !isLoading && <LoansPreview loan={loan} />}
    </DashboardContent>
  );
}
