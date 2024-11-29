import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import { fetchInvoice } from 'src/redux/slices/invoice';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import InvoiceDetails from '../invoice-details';
import InvoiceToolbar from '../invoice-toolbar';

export const INVOICE_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'draft', label: 'Draft' },
];

export function InvoiceDetailView() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { invoice, isLoading } = useSelector((state) => state.invoice);

  useEffect(() => {
    dispatch(fetchInvoice(id));
  }, [dispatch, id]);

  const handleChangeStatus = useCallback((event) => {
    setCurrentStatus(event.target.value);
  }, []);

  const { subtrips, customerId: customer, invoiceStatus, createdDate, _id } = invoice || {};
  const [currentStatus, setCurrentStatus] = useState(invoice?.invoiceStatus);

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

      <InvoiceDetails
        invoiceNo={_id}
        selectedSubtripsData={subtrips}
        customer={customer}
        status={currentStatus}
        createdDate={createdDate}
      />
    </DashboardContent>
  );
}
