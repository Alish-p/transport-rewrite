import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useBanks } from 'src/query/use-bank';
import { useDriver } from 'src/query/use-driver';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { DriverEditView } from 'src/sections/driver/views';

// ----------------------------------------------------------------------

const metadata = { title: `Driver edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { data: banks, isLoading: banksLoading, isError: bankError } = useBanks();
  const { data: driver, isLoading: driverLoading, isError: driverError } = useDriver(id);

  if (banksLoading || driverLoading) {
    return <LoadingScreen />;
  }

  if (bankError || driverError) {
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

      <DriverEditView driver={driver} bankList={banks} />
    </>
  );
}
