import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useCustomers } from 'src/query/use-customer';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { CustomerListView } from 'src/sections/customer/views';
// ----------------------------------------------------------------------

const metadata = { title: `Customer list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: customers, isLoading, isError } = useCustomers();

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

      <CustomerListView customers={customers} />
    </>
  );
}
