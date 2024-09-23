import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchInvoices } from 'src/redux/slices/invoice';

import { InvoiceCreateView } from 'src/sections/invoice/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Invoice | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();
  const { id: currentInvoice } = useParams();

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const { invoices } = useSelector((state) => state.invoice);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InvoiceCreateView invoiceList={invoices} currentInvoice={currentInvoice} />
    </>
  );
}
