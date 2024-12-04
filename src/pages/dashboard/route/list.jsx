import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import { LinearProgress } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { fetchRoutes } from 'src/redux/slices/route';

import { RouteListView } from 'src/sections/route/views';

// ----------------------------------------------------------------------

const metadata = { title: `Route list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRoutes());
  }, [dispatch]);

  const { routes, isLoading } = useSelector((state) => state.route);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {isLoading ? (
        <LinearProgress color="primary" sx={{ mb: 2, width: 1 }} />
      ) : routes?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h3>No routes found</h3>
        </div>
      ) : (
        <RouteListView routes={routes} />
      )}
    </>
  );
}
