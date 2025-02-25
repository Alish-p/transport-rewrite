import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDashboard } from 'src/query/use-dashboard';

import { OverviewAppView } from 'src/sections/overview/app/view';

import { EmptyContent } from '../../components/empty-content';
import { LoadingScreen } from '../../components/loading-screen';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function OverviewAppPage() {
  const { data, isLoading, isError } = useDashboard();

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
      <OverviewAppView dashboardData={data} />
    </>
  );
}
