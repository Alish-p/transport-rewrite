import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { MainLayout } from 'src/layouts/main';
import { SimpleLayout } from 'src/layouts/simple';

import { SplashScreen } from 'src/components/loading-screen';
import { CONFIG } from 'src/config-global';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

const HomePage = lazy(() => import('src/pages/home'));
const MaintenancePage = lazy(() => import('src/pages/maintenance'));

export function Router() {
  if (CONFIG.maintenanceMode) {
    return useRoutes([
      {
        path: '*',
        element: (
          <Suspense fallback={<SplashScreen />}>
            <SimpleLayout>
              <MaintenancePage />
            </SimpleLayout>
          </Suspense>
        ),
      },
    ]);
  }

  return useRoutes([
    {
      path: '/',
      /**
       * Skip home page
       * element: <Navigate to={CONFIG.auth.redirectPath} replace />,
       */
      element: (
        <Suspense fallback={<SplashScreen />}>
          <MainLayout>
            <HomePage />
          </MainLayout>
        </Suspense>
      ),
    },

    // Auth
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard
    ...dashboardRoutes,

    // Main
    ...mainRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
