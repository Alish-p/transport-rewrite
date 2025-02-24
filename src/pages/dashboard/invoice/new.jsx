import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useCustomers } from 'src/query/use-customer';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { InvoiceCreateView } from 'src/sections/invoice/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Invoice | Dashboard - ${CONFIG.site.name}` };

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

      <InvoiceCreateView customerList={customers} />
    </>
  );
}
