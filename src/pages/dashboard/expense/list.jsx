import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useExpenses } from 'src/query/use-expense';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { ExpenseListView } from 'src/sections/expense/views';
// ----------------------------------------------------------------------

const metadata = { title: `Expense list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: expenses, isLoading, isError } = useExpenses();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <EmptyContent
        filled
        title="Error Fetching Expenses !"
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ExpenseListView expenses={expenses} />
    </>
  );
}
