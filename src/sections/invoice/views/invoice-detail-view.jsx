import { useCallback } from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import InvoicePreview from '../invoice-preview';
import InvoiceToolbar from '../invoice-toolbar';
import { InvoiceProvider } from '../context/InvoiceContext';
import { useUpdateInvoiceStatus } from '../../../query/use-invoice';

export const INVOICE_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
];

export function InvoiceDetailView({ invoice }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={invoice._id}
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Invoice', href: '/dashboard/invoice' },
          { name: invoice._id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InvoiceProvider existingInvoice={invoice}>
        <InvoiceDetailContent invoice={invoice} />
      </InvoiceProvider>
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
