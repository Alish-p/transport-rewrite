import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { usePumps } from 'src/query/use-pump';
import { useDieselPrice } from 'src/query/use-diesel-prices';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { DieselPriceEditView } from 'src/sections/diesel-price/views';

// ----------------------------------------------------------------------

const metadata = { title: `Diesel Price edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { data: pumps, isLoading: pumpLoading, isError: pumpError } = usePumps();
  const {
    data: dieselPrice,
    isLoading: dieselPriceLoading,
    isError: dieselPriceError,
  } = useDieselPrice(id);

  if (pumpLoading || dieselPriceLoading) {
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

      <DieselPriceEditView dieselPrice={dieselPrice} pumpsList={pumps} />
    </>
  );
}
