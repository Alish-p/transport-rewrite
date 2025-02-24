import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useDieselPrice } from 'src/query/use-diesel-prices';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { DieselPriceDetailView } from 'src/sections/diesel-price/views';

// ----------------------------------------------------------------------

const metadata = { title: `Diesel Price details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const {
    data: dieselPrice,
    isLoading: dieselPricesLoading,
    isError: dieselPriceError,
  } = useDieselPrice(id);

  if (dieselPricesLoading) {
    return <LoadingScreen />;
  }

  if (dieselPriceError) {
    return <EmptyContent />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DieselPriceDetailView dieselPrice={dieselPrice} />
    </>
  );
}
