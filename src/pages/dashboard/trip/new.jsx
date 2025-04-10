import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTrips } from 'src/query/use-trip';
import { useDrivers } from 'src/query/use-driver';
import { useVehicles } from 'src/query/use-vehicle';
import { useCustomers } from 'src/query/use-customer';

import { TripCreateView } from 'src/sections/trip/views';

import { EmptyContent } from '../../../components/empty-content';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Trip | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: drivers, isLoading: driversLoading, isError: driversError } = useDrivers();
  const { data: vehicles, isLoading: vehiclesLoading, isError: vehiclesError } = useVehicles();
  const { data: trips, isLoading: tripsLoading, isError: tripsError } = useTrips();
  const { data: customers, isLoading: customersLoading, isError: customersError } = useCustomers();

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
