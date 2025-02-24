import { Helmet } from 'react-helmet-async';

import { useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useTrips } from 'src/query/use-trip';
import { useCustomers } from 'src/query/use-customer';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { SubtripCreateView } from 'src/sections/subtrip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Subtrip | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const searchParams = useSearchParams();
  const currentTrip = searchParams.get('id');

  const { data: trips, isLoading: tripLoading, isError: tripError } = useTrips();
  const { data: customers, isLoading: customerLoading, isError: customerError } = useCustomers();

  if (tripLoading || customerLoading) {
    return <LoadingScreen />;
  }

  if (tripError || customerError) {
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

      <SubtripCreateView trips={trips} customers={customers} currentTrip={currentTrip} />
    </>
  );
}
