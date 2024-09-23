import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { paramCase } from '../../../utils/change-case';
import { CustomerDetailView } from '../../../sections/customer/views';

// ----------------------------------------------------------------------

const metadata = { title: `Customer details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentCustomer = useSelector((state) =>
    state.customer.customers.find((customer) => paramCase(customer._id) === id)
  );

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CustomerDetailView customer={currentCustomer} />
    </>
  );
}
