import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDrivers } from 'src/query/use-driver';
import { useVehicles } from 'src/query/use-vehicle';

import { TripCreateView } from 'src/sections/trip/views';

import { EmptyContent } from '../../../components/empty-content';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Trip | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: drivers, isLoading: driversLoading, isError: driversError } = useDrivers();
  const { data: vehicles, isLoading: vehiclesLoading, isError: vehiclesError } = useVehicles();

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
