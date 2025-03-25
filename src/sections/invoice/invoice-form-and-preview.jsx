import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { paths } from 'src/routes/paths';

import { fIsAfter, getFirstDayOfCurrentMonth } from 'src/utils/format-time';

import { useCreateInvoice } from 'src/query/use-invoice';
import { useClosedTripsByCustomerAndDate } from 'src/query/use-subtrip';

import { Form, schemaHelper } from 'src/components/hook-form';

import InvoiceForm from './invoice-form';
import InvoicePreview from './invoice-preview';

// Invoice Schema (Make sure this matches database schema)
export const InvoiceSchema = zod
  .object({
    _id: zod.string().optional(),
    customerId: zod.string().min(1),
    invoiceStatus: zod.string().optional(),
    createdDate: schemaHelper
      .date({ message: { required_error: 'Create date is required!' } })
      .optional(),
    dueDate: schemaHelper.date({ message: { required_error: 'Due date is required!' } }).optional(),
    fromDate: schemaHelper.date({ message: { required_error: 'From date is required!' } }),
    toDate: schemaHelper.date({ message: { required_error: 'To date is required!' } }),
    invoicedSubTrips: zod.array(zod.string().min(1)).optional(),
  })
  .refine((data) => !fIsAfter(data.fromDate, data.toDate), {
    message: 'To-date cannot be earlier than From date!',
    path: ['toDate'],
  });

// Form values and api to create will have ids only
// draft invoice object and api call to fetch will have ids and values

export default function InvoiceFormAndPreview({ customerList }) {
  const navigate = useNavigate();
  const addInvoice = useCreateInvoice();

  const defaultValues = useMemo(
    () => ({
      _id: '',
      customerId: '',
      invoiceStatus: '',
      createdDate: new Date(),
      fromDate: getFirstDayOfCurrentMonth(),
      toDate: new Date(),
      dueDate: new Date(),
      invoicedSubTrips: [],
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(InvoiceSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const {
    invoicedSubTrips,
    customerId: selectedCustomerID,
    createdDate,
    dueDate,
    fromDate,
    toDate,
  } = watch();

  const { data: allSubTripsByCustomer, refetch } = useClosedTripsByCustomerAndDate(
    selectedCustomerID,
    fromDate,
    toDate
  );

  // This callback will be passed to the child button
  const handleFetchSubtrips = () => {
    if (selectedCustomerID && fromDate && toDate) {
      refetch();
    }
  };

  // Construct the draftInvoice object for the preview
  const draftInvoice = useMemo(() => {
    const selectedCustomer = customerList.find((customer) => customer._id === selectedCustomerID);
    return {
      // Match your database schema names:
      invoicedSubTrips: allSubTripsByCustomer?.filter((st) => invoicedSubTrips.includes(st._id)),

      customerId: selectedCustomer
        ? {
            _id: selectedCustomer._id,
            customerName: selectedCustomer.customerName,
            address: selectedCustomer.address,
            cellNo: selectedCustomer.cellNo,
          }
        : { _id: '', customerName: '', address: '', cellNo: '' },
      invoiceStatus: 'draft',
      createdDate: createdDate || new Date(),
      dueDate: dueDate || null,
    };
  }, [
    selectedCustomerID,
    allSubTripsByCustomer,
    customerList,
    createdDate,
    dueDate,
    invoicedSubTrips,
  ]);

  // Handle form submission (create or update)
  const onSubmit = async (data) => {
    console.log({ data, errors });

    try {
      const invoiceData = {
        ...data,
        customerId: selectedCustomerID,
        invoicedSubTrips,
        invoiceStatus: 'pending',
      };
      const createdInvoice = await addInvoice(invoiceData);
      navigate(paths.dashboard.invoice.details(createdInvoice._id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <InvoiceForm
        customersList={customerList}
        filteredSubtrips={allSubTripsByCustomer}
        onFetchSubtrips={handleFetchSubtrips}
      />

      <InvoicePreview invoice={draftInvoice} />

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton type="submit" size="large" variant="contained" loading={isSubmitting}>
          Create Invoice
        </LoadingButton>
      </Stack>
    </Form>
  );
}
