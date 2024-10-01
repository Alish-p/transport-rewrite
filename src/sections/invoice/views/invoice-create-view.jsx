import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, useWatch, Form } from 'react-hook-form';

import { Stack, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { paramCase } from 'src/utils/change-case';

import { addInvoice } from 'src/redux/slices/invoice';
import { fetchSubtrips } from 'src/redux/slices/subtrip';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import InvoiceDetails from '../invoice-details';
import SubtripsSelectors from '../SubtripsSelectors';
import { DashboardContent } from 'src/layouts/dashboard';

export function InvoiceCreateView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subtrips, isLoading } = useSelector((state) => state.subtrip);

  useEffect(() => {
    dispatch(fetchSubtrips());
  }, [dispatch]);

  const methods = useForm({});

  const { handleSubmit } = methods;

  const selectedSubtrips = useWatch({
    control: methods.control,
    name: 'selectedSubtrips',
    defaultValue: [],
  });

  const customer = useWatch({
    control: methods.control,
    name: 'customerId',
    defaultValue: null,
  });

  const handleCreateAndSend = async () => {
    try {
      const createdInvoice = await dispatch(
        addInvoice({ customerId: customer._id, subtrips: selectedSubtrips })
      );

      toast.success('Invoice generated successfully!');
      navigate(paths.dashboard.invoice.view(paramCase(createdInvoice._id)));
    } catch (error) {
      console.error(error);
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
        <SubtripsSelectors />
        <InvoiceDetails
          subtrips={subtrips.filter((st) => selectedSubtrips.includes(st._id))}
          customer={customer}
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
