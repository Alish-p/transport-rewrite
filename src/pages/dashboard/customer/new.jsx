import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useBanks } from 'src/query/use-bank';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { CustomerCreateView } from 'src/sections/customer/views';

// -------------------------------------------------------------

const metadata = { title: `Create a new Customer | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: banks, isLoading, isError } = useBanks();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <EmptyContent filled description="Error Fetching Customers" />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CustomerCreateView bankList={banks || []} />
    </>
  );
}
