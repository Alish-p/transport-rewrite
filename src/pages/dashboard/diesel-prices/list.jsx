import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DieselPriceListView } from 'src/sections/diesel-price/views';

import { usePumps } from '../../../query/use-pump';
import { EmptyContent } from '../../../components/empty-content';
import { useDieselPrices } from '../../../query/use-diesel-prices';
import { LoadingScreen } from '../../../components/loading-screen';

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
