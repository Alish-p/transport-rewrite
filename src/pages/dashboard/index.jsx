import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDashboard, useDashboardCounts, useSubtripMonthlyData } from 'src/query/use-dashboard';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function OverviewAppPage() {
  const { data, isLoading, isError } = useDashboard();
  const { data: counts, isLoading: countsLoading, isError: countsError } = useDashboardCounts();
  const {
    data: subtripMonthlyData,
    isLoading: monthlyLoading,
    isError: monthlyError,
  } = useSubtripMonthlyData();


  if (isLoading || countsLoading || monthlyLoading) {
    return <LoadingScreen />;
  }

  if (isError || countsError || monthlyError) {
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
      <OverviewAppView dashboardData={data} counts={counts} subtripMonthlyData={subtripMonthlyData} />
    </>
  );
}
