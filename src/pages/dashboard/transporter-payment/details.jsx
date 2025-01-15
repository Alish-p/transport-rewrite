import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { dispatch } from 'src/redux/store';
import { fetchPayment } from 'src/redux/slices/transporter-payment';

import { TransporterPaymentDetailView } from 'src/sections/transporter-payment/views';

// ----------------------------------------------------------------------

const metadata = { title: `Transporter Payment details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchPayment(id));
  }, [id]);

  const { payment: transporterPaymentData, isLoading } = useSelector(
    (state) => state.transporterPayment
  );

  console.log(transporterPaymentData);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TransporterPaymentDetailView
        transporterPayment={transporterPaymentData}
        loading={isLoading}
      />
    </>
  );
}
