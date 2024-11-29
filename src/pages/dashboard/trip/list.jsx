import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import { CONFIG } from 'src/config-global';
import { fetchTrips } from 'src/redux/slices/trip';

import { TripListView } from 'src/sections/trip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Trip list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const { trips, isLoading } = useSelector((state) => state.trip);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TripListView trips={trips} />
    </>
  );
}
