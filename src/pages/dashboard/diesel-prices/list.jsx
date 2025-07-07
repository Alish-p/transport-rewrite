import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DieselPriceListView } from 'src/sections/diesel-price/views';

// ----------------------------------------------------------------------

const metadata = { title: `Diesel Price List | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DieselPriceListView />
    </>
  );
}
