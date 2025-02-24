import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useBanks } from 'src/query/use-bank';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { DriverCreateView } from 'src/sections/driver/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Driver | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: banks, isLoading, isError } = useBanks();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <EmptyContent
        filled
        title="Error Fetching Banks !"
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DriverCreateView bankList={banks} />
    </>
  );
}
