import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { usePumps } from 'src/query/use-pump';
import { useRoutes } from 'src/query/use-route';
import { useSubtrip } from 'src/query/use-subtrip';
import { useCustomersSummary } from 'src/query/use-customer';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { SubtripEditView } from 'src/sections/subtrip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Subtrip edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { data: subtrip, isLoading: subtripLoading, isError: subtripError } = useSubtrip(id);
  const { data: routes, isLoading: routesLoading, isError: routesError } = useRoutes(null, null);
  const {
    data: customers,
    isLoading: customersLoading,
    isError: customersError,
  } = useCustomersSummary();
  const { data: pumps, isLoading: pumpsLoading, isError: pumpsError } = usePumps();

  if (subtripLoading || routesLoading || customersLoading) {
    return <LoadingScreen />;
  }

  if (subtripError || routesError || customersError) {
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

      <SubtripEditView
        subtrip={subtrip}
        routesList={routes}
        customersList={customers}
        pumpsList={pumps}
      />
    </>
  );
}
