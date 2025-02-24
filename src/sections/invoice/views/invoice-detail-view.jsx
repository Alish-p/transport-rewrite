import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { DashboardContent } from 'src/layouts/dashboard';
import { updateInvoiceStatus } from 'src/redux/slices/invoice';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import InvoicePreview from '../invoice-preview';
import InvoiceToolbar from '../invoice-toolbar';
import { useUpdateInvoice } from '../../../query/use-invoice';

export const INVOICE_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
];

export function InvoiceDetailView({ invoice }) {
  const dispatch = useDispatch();

  const updateInvoice = useUpdateInvoice();

  const { invoiceStatus, _id } = invoice;

  const handleChangeStatus = useCallback(
    (event) => {
      const newStatus = event.target.value;

      dispatch(updateInvoiceStatus(_id, newStatus));
    },
    [dispatch, _id]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={_id}
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Invoice', href: '/dashboard/invoice' },
          { name: _id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InvoiceToolbar
        invoice={invoice}
        currentStatus={invoiceStatus || ''}
        onChangeStatus={handleChangeStatus}
        statusOptions={INVOICE_STATUS_OPTIONS}
      />

      <InvoicePreview invoice={invoice} />
    </DashboardContent>
  );
}
