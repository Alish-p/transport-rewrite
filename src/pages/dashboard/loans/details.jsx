import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LoanDetailView } from 'src/sections/loans/views';

// ----------------------------------------------------------------------

const metadata = { title: `Loan's details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LoanDetailView />
    </>
  );
}
