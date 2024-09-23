import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RouteListView } from 'src/sections/route/views';
// ----------------------------------------------------------------------

const metadata = { title: `Route list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RouteListView />
    </>
  );
}
