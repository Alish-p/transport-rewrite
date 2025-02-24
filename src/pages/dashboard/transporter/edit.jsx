import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useBanks } from 'src/query/use-bank';
import { useTransporter } from 'src/query/use-transporter';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { TransporterEditView } from 'src/sections/transporter/views';

// ----------------------------------------------------------------------

const metadata = { title: `Transporter edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { data: banks, isLoading: bankLoading, isError: bankError } = useBanks();
  const {
    data: transporter,
    isLoading: transporterLoading,
    isError: transporterError,
  } = useTransporter(id);

  if (bankLoading || transporterLoading) {
    return <LoadingScreen />;
  }

  if (bankError || transporterError) {
    return <EmptyContent />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TransporterEditView transporter={transporter} bankList={banks} />
    </>
  );
}
