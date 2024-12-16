import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BankCreateView } from 'src/sections/bank/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Bank | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BankCreateView />
    </>
  );
}
