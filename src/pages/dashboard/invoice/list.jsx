import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useInvoices } from 'src/query/use-invoice';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { InvoiceListView } from 'src/sections/invoice/views';

// ----------------------------------------------------------------------

const metadata = { title: `Invoice list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: invoices, isLoading, isError } = useInvoices();

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

      <InvoiceListView invoices={invoices} />
    </>
  );
}
