import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'src/routes/hooks';

import { paramCase } from 'src/utils/change-case';

import { CONFIG } from 'src/config-global';
import { fetchInvoices } from 'src/redux/slices/invoice';
import { fetchVehicles } from 'src/redux/slices/vehicle';

import { InvoiceEditView } from 'src/sections/invoice/views';

// ----------------------------------------------------------------------

const metadata = { title: `Invoice edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  const { id = '' } = useParams();

  const currentInvoice = useSelector((state) =>
    state.invoice.invoices.find((invoice) => paramCase(invoice._id) === id)
  );

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchVehicles());
  }, [dispatch]);

  const { invoices } = useSelector((state) => state.invoice);
  const { vehicles } = useSelector((state) => state.vehicle);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InvoiceEditView invoice={currentInvoice} invoices={invoices} vehicles={vehicles} />
    </>
  );
}
