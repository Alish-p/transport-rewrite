import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTransporters } from 'src/query/use-transporter';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { TransporterListView } from 'src/sections/transporter/views';
// ----------------------------------------------------------------------

const metadata = { title: `Transporter list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: transporters, isLoading, isError } = useTransporters();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <EmptyContent />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TransporterListView transporters={transporters} />
    </>
  );
}
