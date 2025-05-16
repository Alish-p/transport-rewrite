import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTransporters } from 'src/query/use-transporter';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { TransporterPaymentCreateView } from 'src/sections/transporter-payment/views';

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
