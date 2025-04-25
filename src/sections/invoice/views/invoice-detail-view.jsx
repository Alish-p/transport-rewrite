import { useCallback } from 'react';

import { DashboardContent } from 'src/layouts/dashboard';
import { useUpdateInvoiceStatus } from 'src/query/use-invoice';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import InvoicePreview from '../invoice-view';
import InvoiceToolbar from '../invoice-toolbar';

export const INVOICE_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
];

export function InvoiceDetailView({ invoice }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={invoice.invoiceNo}
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Invoice', href: '/dashboard/invoice' },
          { name: invoice.invoiceNo },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InvoiceDetailContent invoice={invoice} />
    </DashboardContent>
  );
}

function InvoiceDetailContent({ invoice }) {
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
    <>
      <InvoiceToolbar
        invoice={invoice}
        currentStatus={invoiceStatus || ''}
        onChangeStatus={handleChangeStatus}
        statusOptions={INVOICE_STATUS_OPTIONS}
      />

      <InvoicePreview invoice={invoice} />
    </>
  );
}
