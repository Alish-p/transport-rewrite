import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useVehiclesSummary } from 'src/query/use-vehicle';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { VehicleExpenseCreateView } from 'src/sections/expense/views/vehicle-expense-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Expense | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: vehicles, isLoading, isError } = useVehiclesSummary();

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

      <VehicleExpenseCreateView vehicles={vehicles} />
    </>
  );
}
