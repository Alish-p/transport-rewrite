import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { usePumps } from 'src/query/use-pump';
import { useDieselPrices } from 'src/query/use-diesel-prices';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { DieselPriceListView } from 'src/sections/diesel-price/views';

// ----------------------------------------------------------------------

const metadata = { title: `Diesel Price List | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: pumps, isLoading: pumpLoading, isError: pumpError } = usePumps();
  const {
    data: dieselPrices,
    isLoading: dieselPricesLoading,
    isError: dieselPriceError,
  } = useDieselPrices();

  if (pumpLoading || dieselPricesLoading) {
    return <LoadingScreen />;
  }

  if (pumpError || dieselPriceError) {
    return <EmptyContent />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DieselPriceListView pumpsList={pumps} dieselPrices={dieselPrices} />
    </>
  );
}
