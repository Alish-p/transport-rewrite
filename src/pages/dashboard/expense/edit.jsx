import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { ExpenseEditView } from 'src/sections/expense/views';

import { usePumps } from '../../../query/use-pump';
import { useExpense } from '../../../query/use-expense';
import { useSubtrips } from '../../../query/use-subtrip';
import { useVehicles } from '../../../query/use-vehicle';
import { EmptyContent } from '../../../components/empty-content';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

const metadata = { title: `Expense edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { data: subtrips, isLoading: subtripsLoading, isError: subtripError } = useSubtrips();
  const { data: pumps, isLoading: pumpsLoading, isError: pumpError } = usePumps();
  const { data: vehicles, isLoading: vehiclesLoading, isError: vehicleError } = useVehicles();
  const { data: currentExpense, isLoading: expenseLoading, isError: expenseError } = useExpense(id);

  if (subtripsLoading || pumpsLoading || vehiclesLoading || expenseLoading) {
    return <LoadingScreen />;
  }

  if (subtripError || pumpError || vehicleError || expenseError) {
    return (
      <EmptyContent
        filled
        title="Error Fetching Data !"
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ExpenseEditView
        expense={currentExpense}
        pumps={pumps}
        vehicles={vehicles}
        subtrips={subtrips}
      />
    </>
  );
}
