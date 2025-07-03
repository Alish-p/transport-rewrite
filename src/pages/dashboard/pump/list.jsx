import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { usePumps } from 'src/query/use-pump';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { PumpListView } from 'src/sections/pump/views';
// ----------------------------------------------------------------------

const metadata = { title: `Pump list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: pumps, isLoading, isError } = usePumps();

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

      <PumpListView pumps={pumps} />
    </>
  );
}
