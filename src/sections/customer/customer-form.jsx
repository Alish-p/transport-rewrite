import { toast } from 'sonner';
// ----------------------------------------------------------------------
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Button, Typography } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// redux
import { dispatch } from 'src/redux/store';
import { addCustomer, updateCustomer } from 'src/redux/slices/customer';

// components
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

export const NewCustomerSchema = zod.object({
  customerName: zod.string().min(1, { message: 'Customer Name is required' }),
  address: zod.string().min(1, { message: 'Address is required' }),
  place: zod.string().min(1, { message: 'Place is required' }),
  state: zod.string().min(1, { message: 'State is required' }),
  pinCode: zod
    .string()
    .min(6, { message: 'Pin Code must be exactly 6 digits' })
    .max(6, { message: 'Pin Code must be exactly 6 digits' })
    .regex(/^[0-9]{6}$/, { message: 'Pin Code must be a number' }),
  cellNo: zod
    .string()
    .min(10, { message: 'Cell No must be exactly 10 digits' })
    .max(10, { message: 'Cell No must be exactly 10 digits' })
    .regex(/^[0-9]{10}$/, { message: 'Cell No must be a number' }),
  GSTNo: zod.string().min(1, { message: 'GST No is required' }),
  PANNo: zod
    .string()
    .min(1, { message: 'PAN No is required' })
    .regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, {
      message: 'PAN No must be in the format: five letters followed by four digits and one letter',
    }),
  consignees: zod.array(
    zod.object({
      name: zod.string().min(1, { message: 'Name is required' }),
      address: zod.string().min(1, { message: 'Address is required' }),
      state: zod.string().min(1, { message: 'State is required' }),
      pinCode: zod
        .string()
        .min(6, { message: 'Pin Code must be exactly 6 digits' })
        .max(6, { message: 'Pin Code must be exactly 6 digits' })
        .regex(/^[0-9]{6}$/, { message: 'Pin Code must be a number' }),
    })
  ),
});

// ----------------------------------------------------------------------

export default function CustomerNewForm({ currentCustomer }) {
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      customerName: currentCustomer?.customerName || '',
      address: currentCustomer?.address || '',
      place: currentCustomer?.place || '',
      state: currentCustomer?.state || '',
      pinCode: currentCustomer?.pinCode || '',
      cellNo: currentCustomer?.cellNo || '',
      GSTNo: currentCustomer?.GSTNo || '',
      PANNo: currentCustomer?.PANNo || '',
      consignees: currentCustomer?.consignees || [
        { name: '', address: '', state: '', pinCode: '' },
      ],
    }),
    [currentCustomer]
  );

  const methods = useForm({
    resolver: zodResolver(NewCustomerSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'consignees',
  });

  const values = watch();

  const onSubmit = async (data) => {
    try {
      if (!currentCustomer) {
        await dispatch(addCustomer(data));
      } else {
        await dispatch(updateCustomer(currentCustomer._id, data));
      }
      reset();
      toast.success(
        !currentCustomer ? 'Customer added successfully!' : 'Customer edited successfully!'
      );
      navigate(paths.dashboard.customer.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddConsignee = () => {
    append({ name: '', address: '', state: '', pinCode: '' });
  };

  const handleRemoveConsignee = (index) => {
    remove(index);
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="customerName" label="Customer Name" />
              <Field.Text name="address" label="Address" />
              <Field.Text name="place" label="Place" />
              <Field.Text name="state" label="State" />
              <Field.Text name="pinCode" label="Pin Code" />
              <Field.Text name="cellNo" label="Cell No" />
              <Field.Text name="GSTNo" label="GST No" />
              <Field.Text name="PANNo" label="PAN No" />
            </Box>

            <Typography variant="h6" sx={{ color: 'text.disabled', mt: 3 }}>
              Consignees:
            </Typography>

            {fields.map((field, index) => (
              <Stack key={field.id} spacing={2} sx={{ mt: 2 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(9, 1fr)',
                  }}
                >
                  <Box gridColumn="span 2">
                    <Field.Text name={`consignees[${index}].name`} label="Consignee Name" />
                  </Box>
                  <Box gridColumn="span 2">
                    <Field.Text name={`consignees[${index}].address`} label="Consignee Address" />
                  </Box>
                  <Box gridColumn="span 2">
                    <Field.Text name={`consignees[${index}].state`} label="Consignee State" />
                  </Box>
                  <Box gridColumn="span 2">
                    <Field.Text name={`consignees[${index}].pinCode`} label="Consignee Pin Code" />
                  </Box>
                  <Box
                    gridColumn="span 1"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                      onClick={() => handleRemoveConsignee(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              </Stack>
            ))}

            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleAddConsignee}
              sx={{ mt: 3 }}
            >
              Add Consignee
            </Button>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentCustomer ? 'Create Customer' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
