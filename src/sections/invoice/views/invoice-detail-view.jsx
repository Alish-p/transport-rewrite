import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

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

  const handleChangeStatus = useCallback(
    (event) => {
      const newStatus = event.target.value;
      setCurrentStatus(newStatus);
      dispatch(updateInvoiceStatus(id, newStatus));
    },
    [dispatch, id]
  );

  const [currentStatus, setCurrentStatus] = useState(invoice?.invoiceStatus);

  console.log({ invoice });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="INV-123"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Invoice', href: '/dashboard/invoice' },
          { name: 'INV-123' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {invoice && (
        <InvoiceToolbar
          invoice={invoice}
          currentStatus={currentStatus || ''}
          onChangeStatus={handleChangeStatus}
          statusOptions={INVOICE_STATUS_OPTIONS}
        />
      )}

      {invoice && !isLoading && <InvoiceDetails invoice={invoice} />}
    </DashboardContent>
  );
}
