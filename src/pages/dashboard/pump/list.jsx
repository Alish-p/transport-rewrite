import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PumpListView } from 'src/sections/pump/views';

import { usePumps } from '../../../query/use-pump';
import { EmptyContent } from '../../../components/empty-content';
import { LoadingScreen } from '../../../components/loading-screen';
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
