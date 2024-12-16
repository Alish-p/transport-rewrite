import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchBanks } from 'src/redux/slices/bank';

import { DriverCreateView } from 'src/sections/driver/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Driver | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  const { banks } = useSelector((state) => state.bank);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DriverCreateView bankList={banks || []} />
    </>
  );
}
