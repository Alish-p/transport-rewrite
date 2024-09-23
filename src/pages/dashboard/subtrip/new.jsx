import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchTrips } from 'src/redux/slices/trip';

import { SubtripCreateView } from 'src/sections/subtrip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Subtrip | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();
  const { id: currentTrip } = useParams();

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const { trips } = useSelector((state) => state.trip);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SubtripCreateView tripList={trips} currentTrip={currentTrip} />
    </>
  );
}
