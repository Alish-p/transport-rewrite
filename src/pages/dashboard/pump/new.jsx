import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useBanks } from 'src/query/use-bank';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { PumpCreateView } from 'src/sections/pump/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Pump | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: banks, isLoading: bankLoading, isError: bankError } = useBanks();

  if (bankLoading) {
    return <LoadingScreen />;
  }

  if (bankError) {
    return <EmptyContent />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PumpCreateView bankList={banks} />
    </>
  );
}
