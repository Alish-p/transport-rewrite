import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TransporterListView } from 'src/sections/transporter/views';
// ----------------------------------------------------------------------

const metadata = { title: `Transporter list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TransporterListView />
    </>
  );
}
