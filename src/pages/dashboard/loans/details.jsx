import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useLoan } from 'src/query/use-loan';

import { LoanDetailView } from 'src/sections/loans/views';

import { EmptyContent } from '../../../components/empty-content';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

const metadata = { title: `Loan's details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { data: loan, isLoading, isError } = useLoan(id);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <EmptyContent
        filled
        title="Something went wrong!"
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LoanDetailView loan={loan} />
    </>
  );
}
