import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { ExpenseDetailView } from 'src/sections/expense/views';

import { useExpense } from '../../../query/use-expense';
import { EmptyContent } from '../../../components/empty-content';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

const metadata = { title: `Expense details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { data: currentExpense, isLoading, isError } = useExpense(id);

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

      <ExpenseDetailView expense={currentExpense} />
    </>
  );
}
