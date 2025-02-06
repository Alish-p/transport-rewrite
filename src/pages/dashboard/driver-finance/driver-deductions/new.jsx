import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchDrivers } from 'src/redux/slices/driver';

import { DriverDeductionsCreateView } from 'src/sections/driver-deductions/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Driver Deductions | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDrivers());
  }, [dispatch]);

  const { drivers } = useSelector((state) => state.driver);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DriverDeductionsCreateView driverList={drivers} />
    </>
  );
}
