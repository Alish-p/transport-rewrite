import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useVehiclesSummary } from 'src/query/use-vehicle';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { TripCreateView } from 'src/sections/trip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Trip | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const {
    data: vehicles,
    isLoading: vehiclesLoading,
    isError: vehiclesError,
  } = useVehiclesSummary();

  if (vehiclesLoading) {
    return <LoadingScreen />;
  }

  if (vehiclesError) {
    return <EmptyContent />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TripCreateView vehicles={vehicles} />
    </>
  );
}
