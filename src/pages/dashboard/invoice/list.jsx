import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { fetchInvoices } from 'src/redux/slices/invoice';
import { useSelector, useDispatch } from 'src/redux/store';

import { InvoiceListView } from 'src/sections/invoice/views';

// ----------------------------------------------------------------------

const metadata = { title: `Invoice list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const { invoices, isLoading } = useSelector((state) => state.invoice);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InvoiceListView invoices={invoices} />
    </>
  );
}
