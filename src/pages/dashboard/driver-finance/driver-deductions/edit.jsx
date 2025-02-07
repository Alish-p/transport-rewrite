import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { fetchDrivers } from 'src/redux/slices/driver';
import { fetchDriverDeduction } from 'src/redux/slices/driver-deductions';

import { DriverDeductionsEditView } from 'src/sections/driver-deductions/views';

// ----------------------------------------------------------------------

const metadata = { title: `Driver Deduction edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  const { id = '' } = useParams();

  useEffect(() => {
    dispatch(fetchDriverDeduction(id));
    dispatch(fetchDrivers());
  }, [dispatch, id]);

  const { driverDeduction, isLoading: deductionsLoading } = useSelector(
    (state) => state.driverDeduction
  );
  const { drivers, isLoading: driversLoading } = useSelector((state) => state.driver);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {deductionsLoading || driversLoading ? (
        'Loading...'
      ) : (
        <DriverDeductionsEditView driverDeduction={driverDeduction} driverList={drivers} />
      )}
    </>
  );
}
