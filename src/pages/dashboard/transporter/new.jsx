import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useBanks } from 'src/query/use-bank';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { TransporterCreateView } from 'src/sections/transporter/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Transporter | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: banks, isLoading, isError } = useBanks();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <EmptyContent />;
  }
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TransporterCreateView bankList={banks} />
    </>
  );
}
