import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchDrivers } from 'src/redux/slices/driver';
import { fetchVehicles } from 'src/redux/slices/vehicle';

import { TripCreateView } from 'src/sections/trip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Trip | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDrivers());
    dispatch(fetchVehicles());
  }, [dispatch]);

  const { drivers } = useSelector((state) => state.driver);
  const { vehicles } = useSelector((state) => state.vehicle);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TripCreateView drivers={drivers} vehicles={vehicles} />
    </>
  );
}
