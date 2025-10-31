import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useTransporterPayment } from 'src/query/use-transporter-payment';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { TenantContext } from 'src/auth/tenant';
import { TransporterPaymentDetailView } from 'src/sections/transporter-payment/views';

// ----------------------------------------------------------------------

const metadata = { title: `Transporter Payment | Public - ${CONFIG.site.name}` };

export default function PublicTransporterPaymentDetailsPage() {
  const { id } = useParams();

  const { data: transporterPayment, isLoading, isError } = useTransporterPayment(id);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !transporterPayment) {
    return (
      <EmptyContent
        filled
        title="Unable to load payment details"
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {/* Provide a default tenant for PDFs and headers when not authenticated */}
      <TenantContext.Provider value={CONFIG.company}>
        <TransporterPaymentDetailView transporterPayment={transporterPayment} publicMode />
      </TenantContext.Provider>
    </>
  );
}

