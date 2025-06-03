import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTrips } from 'src/query/use-trip';
import { useDrivers } from 'src/query/use-driver';
import { useVehicles } from 'src/query/use-vehicle';
import { useCustomersSummary } from 'src/query/use-customer';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { TripCreateView } from 'src/sections/trip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Trip | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: drivers, isLoading: driversLoading, isError: driversError } = useDrivers();
  const { data: vehicles, isLoading: vehiclesLoading, isError: vehiclesError } = useVehicles();
  const { data: trips, isLoading: tripsLoading, isError: tripsError } = useTrips();
  const {
    data: customers,
    isLoading: customersLoading,
    isError: customersError,
  } = useCustomersSummary();

  if (driversLoading || vehiclesLoading || tripsLoading || customersLoading) {
    return <LoadingScreen />;
  }

  if (driversError || vehiclesError || tripsError || customersError) {
    return <EmptyContent />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TripCreateView drivers={drivers} vehicles={vehicles} trips={trips} customers={customers} />
    </>
  );
}
