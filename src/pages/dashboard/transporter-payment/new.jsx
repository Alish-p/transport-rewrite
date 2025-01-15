import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchTransporters } from 'src/redux/slices/transporter';

import { TransporterPaymentCreateView } from 'src/sections/transporter-payment/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Transporter Payment | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTransporters());
  }, [dispatch]);

  const { transporters } = useSelector((state) => state.transporter);

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <TransporterPaymentCreateView transporterList={transporters} />
    </>
  );
}
