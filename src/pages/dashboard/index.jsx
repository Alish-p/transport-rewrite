import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDispatch, useSelector } from 'src/redux/store';
import { fetchDashboardSummary } from 'src/redux/slices/dashboard';

import { OverviewAppView } from '../../sections/overview/app/view';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function OverviewAppPage() {
  const disptach = useDispatch();

  useEffect(() => {
    disptach(fetchDashboardSummary());
  }, [disptach]);

  const dashboardData = useSelector((state) => state.dashboard.summary);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {dashboardData && Object.keys(dashboardData).length > 0 && (
        <OverviewAppView dashboardData={dashboardData} />
      )}
    </>
  );
}
