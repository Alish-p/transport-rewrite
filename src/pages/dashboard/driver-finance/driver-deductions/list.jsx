import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useSelector, useDispatch } from 'src/redux/store';
import { fetchDriverDeductions } from 'src/redux/slices/driver-deductions';

import { DriverDeductionsListView } from 'src/sections/driver-deductions/views';

// ----------------------------------------------------------------------

const metadata = { title: `Driver Deductions list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDriverDeductions());
  }, [dispatch]);

  const { driverDeductions, isLoading } = useSelector((state) => state.driverDeduction);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DriverDeductionsListView driverDeductions={driverDeductions} />
    </>
  );
}
