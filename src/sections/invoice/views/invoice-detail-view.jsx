import { useParams } from 'react-router';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DashboardContent } from 'src/layouts/dashboard';
import { fetchInvoice, updateInvoiceStatus } from 'src/redux/slices/invoice';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import InvoiceDetails from '../invoice-preview';
import InvoiceToolbar from '../invoice-toolbar';

export const INVOICE_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
];

export function InvoiceDetailView() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { invoice, isLoading } = useSelector((state) => state.invoice);

  useEffect(() => {
    dispatch(fetchInvoice(id));
  }, [dispatch, id]);

  const invoiceStatus = invoice?.invoiceStatus;

  const handleChangeStatus = useCallback(
    (event) => {
      const newStatus = event.target.value;

      dispatch(updateInvoiceStatus(id, newStatus));
    },
    [dispatch, id]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={id}
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Invoice', href: '/dashboard/invoice' },
          { name: id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {invoice && (
        <InvoiceToolbar
          invoice={invoice}
          currentStatus={invoiceStatus || ''}
          onChangeStatus={handleChangeStatus}
          statusOptions={INVOICE_STATUS_OPTIONS}
        />
      )}

      {invoice && !isLoading && <InvoiceDetails invoice={invoice} />}
    </DashboardContent>
  );
}
