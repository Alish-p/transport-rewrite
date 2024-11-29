import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchCustomers } from 'src/redux/slices/customer';

import { InvoiceCreateView } from 'src/sections/invoice/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Invoice | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const { customers } = useSelector((state) => state.customer);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InvoiceCreateView customerList={customers} />
    </>
  );
}
