import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTrips } from 'src/query/use-trip';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { TripListView } from 'src/sections/trip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Trip list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: trips, isLoading, isError } = useTrips();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <EmptyContent
        filled
        title="Something went wrong!"
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TripListView trips={trips} />
    </>
  );
}
