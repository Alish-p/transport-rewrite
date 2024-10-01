import Container from '@mui/material/Container';
import { useParams } from 'react-router';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { Button, Stack } from '@mui/material';
import SubtripsSelectors from '../SubtripsSelectors';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import InvoiceDetails from '../invoice-details';
import { fetchSubtrips } from 'src/redux/slices/subtrip';
import { addInvoice, fetchInvoice } from 'src/redux/slices/invoice';
import InvoiceToolbar from '../invoice-toolbar';

export const INVOICE_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'draft', label: 'Draft' },
];

export function InvoiceDetailView() {
  const settings = useSettingsContext();
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
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
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
        subtrips={subtrips}
        customer={customer}
        status={currentStatus}
        createdDate={createdDate}
      />
    </Container>
  );
}
