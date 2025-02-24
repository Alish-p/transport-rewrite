import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTransporterPayments } from 'src/query/use-transporter-payment';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { TransporterPaymentListView } from 'src/sections/transporter-payment/views';

// ----------------------------------------------------------------------

const metadata = { title: `Transporter Payment List | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: transporterPayments, isLoading, isError } = useTransporterPayments();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <EmptyContent
        filled
        title="Something went wrong!"
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <TransporterPaymentListView payments={transporterPayments} />
    </>
  );
}
