import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RouteCreateView } from 'src/sections/route/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Route | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RouteCreateView />
    </>
  );
}
