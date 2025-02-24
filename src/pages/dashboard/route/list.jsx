import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useRoutes } from 'src/query/use-route';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { RouteListView } from 'src/sections/route/views';

// ----------------------------------------------------------------------

const metadata = { title: `Route list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: routes, isLoading, isError } = useRoutes();

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

      <RouteListView routes={routes} />
    </>
  );
}
