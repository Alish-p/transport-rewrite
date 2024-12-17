import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'src/routes/hooks';

import { paramCase } from 'src/utils/change-case';

import { CONFIG } from 'src/config-global';
import { fetchBanks } from 'src/redux/slices/bank';

import { CustomerEditView } from 'src/sections/customer/views';

// ----------------------------------------------------------------------

const metadata = { title: `Customer edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentCustomer = useSelector((state) =>
    state.customer.customers.find((customer) => paramCase(customer._id) === id)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  const { banks } = useSelector((state) => state.bank);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CustomerEditView customer={currentCustomer} bankList={banks || []} />
    </>
  );
}
