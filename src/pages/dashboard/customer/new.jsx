import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import { CONFIG } from 'src/config-global';
import { fetchBanks } from 'src/redux/slices/bank';

import { CustomerCreateView } from 'src/sections/customer/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Customer | Dashboard - ${CONFIG.site.name}` };

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

      <CustomerCreateView bankList={banks || []} />
    </>
  );
}
