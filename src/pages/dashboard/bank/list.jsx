import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BankListView } from 'src/sections/bank/views';

// ----------------------------------------------------------------------

const metadata = { title: `Bank list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BankListView />
    </>
  );
}
