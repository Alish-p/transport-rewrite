import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useLoans } from 'src/query/use-loan';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { LoansListView } from 'src/sections/loans/views';

// ----------------------------------------------------------------------

const metadata = { title: `Loans list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: loans, isLoading: loansLoading, isError: loansError } = useLoans();

  if (loansLoading) {
    return <LoadingScreen />;
  }

  if (loansError) {
    return <EmptyContent />;
  }
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LoansListView loans={loans} />
    </>
  );
}
