import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchDrivers } from 'src/redux/slices/driver';

import { LoansCreateView } from 'src/sections/loans/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Loan | Dashboard - ${CONFIG.site.name}` };

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

      <LoansCreateView driverList={drivers} />
    </>
  );
}
