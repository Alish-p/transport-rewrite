import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TransporterPaymentCreateView } from 'src/sections/transporter-payment/views';

import { useTransporters } from '../../../query/use-transporter';
import { EmptyContent } from '../../../components/empty-content';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Transporter Payment | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: transporters, isLoading, isError } = useTransporters();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <EmptyContent />;
  }

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <TransporterPaymentCreateView transporterList={transporters} />
    </>
  );
}
