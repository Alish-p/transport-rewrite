import { useCallback } from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import InvoicePreview from '../invoice-preview';
import InvoiceToolbar from '../invoice-toolbar';
import { useUpdateInvoiceStatus } from '../../../query/use-invoice';

export const INVOICE_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
];

export function InvoiceDetailView({ invoice }) {
  const updateInvoice = useUpdateInvoiceStatus();

  const { invoiceStatus, _id } = invoice;

  const handleChangeStatus = useCallback(
    (event) => {
      const newStatus = event.target.value;
      updateInvoice({ id: _id, status: newStatus });
    },
    [updateInvoice, _id]
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
