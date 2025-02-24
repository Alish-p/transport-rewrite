import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { PumpDetailView } from 'src/sections/pump/views';

import { usePump } from '../../../query/use-pump';
import { EmptyContent } from '../../../components/empty-content';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

const metadata = { title: `Pump details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { data: pump, isLoading, isError } = usePump(id);

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

      <PumpDetailView pump={pump} />
    </>
  );
}
