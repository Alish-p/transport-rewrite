import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useRoute } from 'src/query/use-route';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { RouteEditView } from 'src/sections/route/views';

// ----------------------------------------------------------------------

const metadata = { title: `Route edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { data: route, isLoading: routeLoading, isError: routeError } = useRoute(id);
  if (routeLoading) {
    return <LoadingScreen />;
  }

  if (routeError) {
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

      <RouteEditView route={route} />
    </>
  );
}
