import { useEffect } from 'react';
import { useParams } from 'react-router';

import { paths } from 'src/routes/paths';

import { fetchInvoice } from 'src/redux/slices/invoice';
import { dispatch, useSelector } from 'src/redux/store';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import InvoiceFormAndPreview from '../invoice-form-and-preview';

export function InvoiceEditView({ customerList }) {
  const { id } = useParams();
  const { invoice: currentInvoice } = useSelector((state) => state.invoice);

  useEffect(() => {
    if (id) {
      dispatch(fetchInvoice(id));
    }
  }, [id]);

  if (!currentInvoice) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Invoice"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Invoice', href: paths.dashboard.invoice.root },
          { name: currentInvoice._id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InvoiceFormAndPreview currentInvoice={currentInvoice} customerList={customerList} />
    </DashboardContent>
  );
}
