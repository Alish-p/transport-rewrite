import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { dispatch } from 'src/redux/store';
import { fetchPayments } from 'src/redux/slices/transporter-payment';

import { TransporterPaymentListView } from 'src/sections/transporter-payment/views';

// ----------------------------------------------------------------------

const metadata = { title: `Transporter Payment List | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  useEffect(() => {
    dispatch(fetchPayments());
  }, []);

  const { payments, isLoading } = useSelector((state) => state.transporterPayment);

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <TransporterPaymentListView payments={payments} loading={isLoading} />
    </>
  );
}
