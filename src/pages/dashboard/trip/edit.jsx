import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useDrivers } from 'src/query/use-driver';
import { useVehicles } from 'src/query/use-vehicle';
import { useCustomers } from 'src/query/use-customer';
import { useTrip, useTrips } from 'src/query/use-trip';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { TripEditView } from 'src/sections/trip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Trip edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { data: trip, isLoading: tripLoading, isError: tripError } = useTrip(id);
  const { data: drivers, isLoading: driversLoading, isError: driversError } = useDrivers();
  const { data: vehicles, isLoading: vehiclesLoading, isError: vehiclesError } = useVehicles();
  const { data: trips, isLoading: tripsLoading, isError: tripsError } = useTrips();
  const { data: customers, isLoading: customersLoading, isError: customersError } = useCustomers();

  if (tripLoading || driversLoading || vehiclesLoading || tripsLoading || customersLoading) {
    return <LoadingScreen />;
  }

  if (tripError || driversError || vehiclesError || tripsError || customersError) {
    return <EmptyContent />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TripEditView
        trip={trip}
        vehicles={vehicles}
        drivers={drivers}
        trips={trips}
        customers={customers}
      />
    </>
  );
}
