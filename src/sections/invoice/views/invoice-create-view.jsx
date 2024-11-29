import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { Stack, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fIsAfter } from 'src/utils/format-time';
import { paramCase } from 'src/utils/change-case';

import { addInvoice } from 'src/redux/slices/invoice';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Form, schemaHelper } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import InvoiceDetails from '../invoice-details';
import SubtripsSelectors from '../SubtripsSelectors';

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
    closedSubtripData: zod.array(zod.string().min(1)).optional(), // all closed subtrips of a customer
    selectedSubtrips: zod.array(zod.string().min(1)).optional(),

    totalAmount: zod
      .number({ required_error: 'Total amount is required' })
      .positive({ message: 'Total amount must be greater than zero' }),
  })
  .refine((data) => !fIsAfter(data.fromDate, data.toDate), {
    message: 'To-date cannot be earlier than From date!',
    path: ['toDate'],
  });

export function InvoiceCreateView({ customerList }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      _id: '',
      customerId: '',
      invoiceStatus: '',
      createdDate: new Date(),
      fromDate: new Date(),
      toDate: new Date(),
      dueDate: null,
      selectedSubtrips: [],
      totalAmount: 0,
      closedSubtripData: [],
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(InvoiceSchema),
    defaultValues,
    mode: 'all',
  });

  const { handleSubmit, watch } = methods;

  const { selectedSubtrips, customerId: selectedCustomerID, closedSubtripData } = watch();

  const handleCreateAndSend = async () => {
    try {
      const createdInvoice = await dispatch(
        addInvoice({
          customerId: selectedCustomerID,
          subtrips: selectedSubtrips,
          invoiceStatus: 'pending',
        })
      );

      toast.success('Invoice generated successfully!');

      // Navigate to the invoice details page using the created invoice's ID
      navigate(paths.dashboard.invoice.details(paramCase(createdInvoice._id)));
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create invoice!');
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="INV-XXX"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Invoice', href: '/dashboard/invoice' },
          { name: 'INV-XXX' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={handleSubmit(handleCreateAndSend)}>
        <SubtripsSelectors customersList={customerList} />
        <InvoiceDetails
          selectedSubtripsData={closedSubtripData.filter((st) => selectedSubtrips.includes(st._id))}
          customer={customerList.find((customer) => customer._id === selectedCustomerID)}
        />
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button size="large" variant="contained" onClick={handleCreateAndSend}>
            Create
          </Button>
        </Stack>
      </Form>
    </DashboardContent>
  );
}
