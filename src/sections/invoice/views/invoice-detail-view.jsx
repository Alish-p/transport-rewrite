import { useCallback } from 'react';

import { DashboardContent } from 'src/layouts/dashboard';
import { useUpdateInvoiceStatus } from 'src/query/use-invoice';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import InvoiceView from '../invoice-view';
import InvoiceToolbar from '../invoice-toolbar';

// Available invoice status options
const INVOICE_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
];

// Main component to display invoice details and allow status update
export function InvoiceDetailView({ invoice }) {
  const updateInvoice = useUpdateInvoiceStatus();

  const { invoiceStatus = '', _id, invoiceNo } = invoice;

  // Callback to handle status change from the toolbar dropdown
  const handleChangeStatus = useCallback(
    (event) => {
      const newStatus = event.target.value;
      updateInvoice({ id: _id, status: newStatus });
    },
    [updateInvoice, _id]
  );

  return (
    <DashboardContent>
      {/* Breadcrumb navigation */}
      <CustomBreadcrumbs
        heading={invoiceNo}
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Invoice', href: '/dashboard/invoice' },
          { name: invoiceNo },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* Toolbar for status update and action buttons */}
      <InvoiceToolbar
        invoice={invoice}
        currentStatus={invoiceStatus}
        onChangeStatus={handleChangeStatus}
        statusOptions={INVOICE_STATUS_OPTIONS}
      />

      {/* Invoice display content */}
      <InvoiceView invoice={invoice} />
    </DashboardContent>
  );
}
