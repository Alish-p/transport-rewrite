import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useCustomersSummary } from 'src/query/use-customer';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { RouteCreateView } from 'src/sections/route/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Route | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: customers, isLoading, isError } = useCustomersSummary();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <EmptyContent />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RouteCreateView customers={customers} />
    </>
  );
}
