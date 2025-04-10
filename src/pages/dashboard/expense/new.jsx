import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SubtripExpenseCreateView } from 'src/sections/expense/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Expense | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SubtripExpenseCreateView />
    </>
  );
}
