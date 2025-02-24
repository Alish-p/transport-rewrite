import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useVehicles } from 'src/query/use-vehicle';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { VehicleListView } from 'src/sections/vehicle/views';
// ----------------------------------------------------------------------

const metadata = { title: `Invoice list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: vehicles, isLoading, isError } = useVehicles();

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
