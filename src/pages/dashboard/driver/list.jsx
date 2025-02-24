import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDrivers } from 'src/query/use-driver';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { DriverListView } from 'src/sections/driver/views';
// ----------------------------------------------------------------------

const metadata = { title: `Driver list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: drivers, isLoading, isError } = useDrivers();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <EmptyContent
        filled
        title="Error Fetching Drivers !"
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DriverListView drivers={drivers} />
    </>
  );
}
