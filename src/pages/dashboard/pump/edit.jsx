import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { usePump } from 'src/query/use-pump';
import { useBanks } from 'src/query/use-bank';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { PumpEditView } from 'src/sections/pump/views';

// ----------------------------------------------------------------------

const metadata = { title: `Pump edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { data: banks, isLoading: bankLoading, isError: bankError } = useBanks();
  const { data: pump, isLoading: pumpLoading } = usePump(id);

  if (bankLoading || pumpLoading) {
    return <LoadingScreen />;
  }

  if (bankError || bankError) {
    return <EmptyContent />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PumpEditView pump={pump} bankList={banks} />
    </>
  );
}
