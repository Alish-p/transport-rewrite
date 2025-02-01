import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { paramCase } from 'src/utils/change-case';

import { CONFIG } from 'src/config-global';

import { DieselPriceDetailView } from 'src/sections/diesel-price/views';

// ----------------------------------------------------------------------

const metadata = { title: `Diesel Price details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentDieselPrice = useSelector((state) =>
    state.dieselPrice.dieselPrices.find((price) => paramCase(price._id) === id)
  );

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DieselPriceDetailView dieselPrice={currentDieselPrice} />
    </>
  );
}
