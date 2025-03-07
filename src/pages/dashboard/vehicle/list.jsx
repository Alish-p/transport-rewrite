import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useVehicles } from 'src/query/use-vehicle';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { VehicleListView } from 'src/sections/vehicle/views';

import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------

const metadata = { title: `Vehicle list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: vehicles, isLoading, isError } = useVehicles();
  const { user } = useAuthContext();

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

      <VehicleListView vehicles={vehicles} />
    </>
  );
}
