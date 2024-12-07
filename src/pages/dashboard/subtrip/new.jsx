import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchTrips } from 'src/redux/slices/trip';

import { SubtripCreateView } from 'src/sections/subtrip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Subtrip | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const currentTrip = searchParams.get('id');

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const { trips, loading } = useSelector((state) => state.trip);

  if (loading) return <div>Loading...</div>;
  if (!trips) return <div>No Trips Available...</div>;

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SubtripCreateView tripList={trips} currentTrip={currentTrip} />
    </>
  );
}
