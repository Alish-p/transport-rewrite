import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { dispatch } from 'src/redux/store';
import { fetchInvoice } from 'src/redux/slices/invoice';

import { InvoiceDetailView } from 'src/sections/invoice/views';

// ----------------------------------------------------------------------

const metadata = { title: `Invoice details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchInvoice(id));
  }, [id]);

  const { invoice: invoiceData, isLoading } = useSelector((state) => state.invoice);

  console.log(invoiceData);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InvoiceDetailView invoice={invoiceData} loading={isLoading} />
    </>
  );
}
