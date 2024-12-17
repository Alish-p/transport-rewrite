import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { fetchBanks } from 'src/redux/slices/bank';
import { useDispatch, useSelector } from 'src/redux/store';

import { TransporterCreateView } from 'src/sections/transporter/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Transporter | Dashboard - ${CONFIG.site.name}` };

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

      <TransporterCreateView bankList={banks || []} />
    </>
  );
}
