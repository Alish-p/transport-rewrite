import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useRoute } from 'src/query/use-route';
import { useCustomers } from 'src/query/use-customer';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { RouteEditView } from 'src/sections/route/views';

// ----------------------------------------------------------------------

const metadata = { title: `Route edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { data: route, isLoading: routeLoading, isError: routeError } = useRoute(id);
  const { data: customers, isLoading: customersLoading, isError: customersError } = useCustomers();

  if (routeLoading || customersLoading) {
    return <LoadingScreen />;
  }

  if (routeError || customersError) {
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

      <RouteEditView route={route} customers={customers} />
    </>
  );
}
