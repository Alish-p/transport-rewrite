import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { dispatch } from 'src/redux/store';
import { fetchVehicles } from 'src/redux/slices/vehicle';
import { fetchPayments } from 'src/redux/slices/transporter-payment';

import { TransporterPaymentEditView } from 'src/sections/transporter-payment/views';

// ----------------------------------------------------------------------

const metadata = { title: `Transporter Payment Edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentPayment = useSelector((state) =>
    state.transporterPayment.payments.find((payment) => payment._id === id)
  );

  useEffect(() => {
    dispatch(fetchPayments());
    dispatch(fetchVehicles());
  }, []);

  const { payments } = useSelector((state) => state.transporterPayment);
  const { vehicles } = useSelector((state) => state.vehicle);

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <TransporterPaymentEditView
        payment={currentPayment}
        payments={payments}
        vehicles={vehicles}
      />
    </>
  );
}
