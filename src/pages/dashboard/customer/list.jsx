import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CustomerListView } from 'src/sections/customer/views';
// ----------------------------------------------------------------------

const metadata = { title: `Customer list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CustomerListView />
    </>
  );
}
