import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { fetchLoan } from 'src/redux/slices/loan';
import { fetchDrivers } from 'src/redux/slices/driver';

import { LoanEditView } from 'src/sections/loans/views';

// ----------------------------------------------------------------------

const metadata = { title: `Loan edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  const { id = '' } = useParams();

  useEffect(() => {
    dispatch(fetchLoan(id));
    dispatch(fetchDrivers());
  }, [dispatch, id]);

  const { loan, isLoading: loanLoading } = useSelector((state) => state.loan);
  const { drivers, isLoading: driversLoading } = useSelector((state) => state.driver);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {loanLoading || driversLoading ? (
        'Loading...'
      ) : (
        <LoanEditView loan={loan} driverList={drivers} />
      )}
    </>
  );
}
