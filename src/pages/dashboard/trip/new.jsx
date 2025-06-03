import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDriversSummary } from 'src/query/use-driver';
import { useVehiclesSummary } from 'src/query/use-vehicle';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { TripCreateView } from 'src/sections/trip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Trip | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: drivers, isLoading: driversLoading, isError: driversError } = useDriversSummary();
  const {
    data: vehicles,
    isLoading: vehiclesLoading,
    isError: vehiclesError,
  } = useVehiclesSummary();

  if (driversLoading || vehiclesLoading) {
    return <LoadingScreen />;
  }

  if (driversError || vehiclesError) {
    return <EmptyContent />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TripCreateView drivers={drivers} vehicles={vehicles} />
    </>
  );
}
