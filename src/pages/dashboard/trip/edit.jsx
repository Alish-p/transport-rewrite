import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { fetchTrip } from 'src/redux/slices/trip';
import { fetchDrivers } from 'src/redux/slices/driver';
import { fetchVehicles } from 'src/redux/slices/vehicle';

import { TripEditView } from 'src/sections/trip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Trip edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  const { id = '' } = useParams();

  useEffect(() => {
    dispatch(fetchTrip(id));
    dispatch(fetchDrivers());
    dispatch(fetchVehicles());
  }, [dispatch, id]);

  const { trip: tripData, isLoading } = useSelector((state) => state.trip);
  const { vehicles } = useSelector((state) => state.vehicle);
  const { drivers } = useSelector((state) => state.driver);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TripEditView trip={tripData} vehicles={vehicles} drivers={drivers} />
    </>
  );
}
