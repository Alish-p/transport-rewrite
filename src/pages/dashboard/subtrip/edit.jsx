import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useRoutes } from 'src/query/use-route';
import { useSubtrip } from 'src/query/use-subtrip';
import { useCustomers } from 'src/query/use-customer';

import { SubtripEditView } from 'src/sections/subtrip/views';

import { EmptyContent } from '../../../components/empty-content';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

const metadata = { title: `Subtrip edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { data: subtrip, isLoading: subtripLoading, isError: subtripError } = useSubtrip(id);
  const { data: routes, isLoading: routesLoading, isError: routesError } = useRoutes();
  const { data: customers, isLoading: customersLoading, isError: customersError } = useCustomers();

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

      <SubtripEditView subtrip={subtrip} routesList={routes} customersList={customers} />
    </>
  );
}
