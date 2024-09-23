import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { dispatch } from 'src/redux/store';
import { fetchTrip } from 'src/redux/slices/trip';

import { TripDetailView } from 'src/sections/trip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Trip details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchTrip(id));
  }, [id]);

  const { trip: tripData, isLoading } = useSelector((state) => state.trip);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {tripData && <TripDetailView trip={tripData} loading={isLoading} />}
    </>
  );
}
