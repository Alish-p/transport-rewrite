import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { usePumps } from 'src/query/use-pump';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { DieselPriceCreateView } from 'src/sections/diesel-price/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Diesel Price | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: pumps, isLoading: pumpLoading, isError: pumpError } = usePumps();

  if (pumpLoading) {
    return <LoadingScreen />;
  }

  if (pumpError) {
    return <EmptyContent />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DieselPriceCreateView pumpsList={pumps} />
    </>
  );
}
