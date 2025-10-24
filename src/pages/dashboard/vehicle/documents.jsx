import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { VehicleDocumentsListView } from 'src/sections/vehicle/documents/views';

// ----------------------------------------------------------------------

const metadata = { title: `Documents | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <VehicleDocumentsListView />
    </>
  );
}
