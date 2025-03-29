import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Divider,
  MenuItem,
  Typography,
  InputAdornment,
} from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// components
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useBoolean } from '../../hooks/use-boolean';
import { vehicleTypes } from '../vehicle/vehicle-config';
import { useCreateRoute, useUpdateRoute } from '../../query/use-route';
import { KanbanCustomerDialog } from '../kanban/components/kanban-customer-dialog';

// ----------------------------------------------------------------------

export const NewRouteSchema = zod
  .object({
    routeName: zod.string().min(1, { message: 'Route Name is required' }),
    tollAmt: zod.number({ required_error: 'Toll Amount is required' }),
    fromPlace: zod.string().min(1, { message: 'From Place is required' }),
    toPlace: zod.string().min(1, { message: 'To Place is required' }),
    noOfDays: zod.number({ required_error: 'Number of Days is required' }),
    ratePerTon: zod.number({ required_error: 'Rate per Ton is required' }),
    distance: zod.number({ required_error: 'Distance is required' }),
    validFromDate: schemaHelper.date({ message: { required_error: 'From date is required!' } }),
    validTillDate: schemaHelper.date({ message: { required_error: 'Till date is required!' } }),
    isCustomerSpecific: zod.boolean(),
    customer: zod.string().optional(),
    salary: zod.array(
      zod.object({
        vehicleType: zod.string().min(1, { message: 'Vehicle Type is required' }),
        fixedSalary: zod.number().min(0, { message: 'Fixed Salary is required' }),
        percentageSalary: zod.number().min(0, { message: 'Percentage Salary is required' }),
        fixMilage: zod.number({ required_error: 'Fixed Milage is required' }),
        performanceMilage: zod.number({ required_error: 'Performance Milage is required' }),
        advanceAmt: zod.number({ required_error: 'Advance Amount is required' }),
        diesel: zod.number({ required_error: 'Diesel is required' }),
        adBlue: zod.number({ required_error: 'Ad Blue is required' }),
      })
    ),
  })
  .refine((data) => !data.isCustomerSpecific || data.customer, {
    message: 'Customer is required when the Route is not Generic',
    path: ['customer'],
  });

export default function RouteForm({ currentRoute, customers }) {
  const navigate = useNavigate();
  const customerDialog = useBoolean(false);

  const createRoute = useCreateRoute();
  const updateRoute = useUpdateRoute();

  const defaultValues = useMemo(
    () => ({
      routeName: currentRoute?.routeName || '',
      tollAmt: currentRoute?.tollAmt || 0,
      fromPlace: currentRoute?.fromPlace || '',
      toPlace: currentRoute?.toPlace || '',
      noOfDays: currentRoute?.noOfDays || 0,

      ratePerTon: currentRoute?.ratePerTon || 0,
      distance: currentRoute?.distance || 0,
      validFromDate: currentRoute?.validFromDate
        ? new Date(currentRoute?.validFromDate)
        : new Date(),

      validTillDate: new Date(
        currentRoute?.validTillDate || new Date().setFullYear(new Date().getFullYear() + 1)
      ),

      isCustomerSpecific: currentRoute?.isCustomerSpecific || true,
      customer: currentRoute?.customer?._id || '',

      salary: currentRoute?.salary || [
        {
          vehicleType: '',
          fixedSalary: 0,
          percentageSalary: 0,
          fixMilage: 0,
          performanceMilage: 0,
          advanceAmt: 0,
          diesel: 0,
          adBlue: 0,
        },
      ],
    }),
    [currentRoute]
  );

  const methods = useForm({
    resolver: zodResolver(NewRouteSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    watch,
    setValue,
  } = methods;

  const values = watch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'salary',
  });

  console.log({ errors });

  const selectedCustomer = customers.find((c) => c._id === values.customer);

  const onSubmit = async (data) => {
    try {
      if (!currentRoute) {
        await createRoute(data);
      } else {
        await updateRoute({ id: currentRoute._id, data });
      }
      reset();
      navigate(paths.dashboard.route.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSalary = () => {
    append({
      vehicleType: '',
      fixedSalary: 0,
      percentageSalary: 0,
      fixMilage: 0,
      performanceMilage: 0,
      advanceAmt: 0,
      diesel: 0,
      adBlue: 0,
    });
  };

  const handleRemoveSalary = (index) => {
    remove(index);
  };

  const handleCustomerChange = (customer) => {
    setValue('customer', customer._id);
  };

  const renderRouteDetails = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Route Details
      </Typography>
      <Card sx={{ p: 3, mb: 3 }}>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Field.Text name="routeName" label="Route Name" />
          <Field.Text
            name="tollAmt"
            label="Toll Amount"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">₹</InputAdornment>,
            }}
          />

          <Field.Text name="fromPlace" label="From Place" />
          <Field.Text name="toPlace" label="To Place" />
          <Field.Text
            name="noOfDays"
            label="Number of Days"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">Days</InputAdornment>,
            }}
          />

          <Field.Text
            name="distance"
            label="Distance"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">KM</InputAdornment>,
            }}
          />
          <Field.DatePicker name="validFromDate" label="Valid From Date" />

          <Field.DatePicker name="validTillDate" label="Valid Till Date" />
        </Box>
      </Card>
    </>
  );

  const renderCustomerField = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Customer Details
      </Typography>
      <Card sx={{ p: 3, mb: 3 }}>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Field.Switch
            name="isCustomerSpecific"
            labelPlacement="start"
            label={
              <>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Customer-Specific Route?
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Please disable this option if the route is general or shared. Enable it only for
                  customer-specific routes.
                </Typography>
              </>
            }
            sx={{ mx: 0, my: 1, width: 1, justifyContent: 'space-between' }}
          />
          {values.isCustomerSpecific && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Customer
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                onClick={customerDialog.onTrue}
                sx={{
                  height: 56,
                  justifyContent: 'flex-start',
                  typography: 'body2',
                }}
                startIcon={
                  <Iconify
                    icon={selectedCustomer ? 'mdi:office-building' : 'mdi:office-building-outline'}
                    sx={{ color: selectedCustomer ? 'primary.main' : 'text.disabled' }}
                  />
                }
              >
                {selectedCustomer ? selectedCustomer.customerName : 'Select Customer'}
              </Button>
            </Box>
          )}
        </Box>
      </Card>

      <KanbanCustomerDialog
        open={customerDialog.value}
        onClose={customerDialog.onFalse}
        selectedCustomer={selectedCustomer}
        onCustomerChange={handleCustomerChange}
      />
    </>
  );

  const renderSalaryFields = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Salaries:
      </Typography>

      <Card sx={{ p: 3, mb: 3 }}>
        {fields.map((field, index) => (
          <Stack key={field.id} spacing={2} sx={{ mt: 2 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(12, 1fr)',
              }}
              sx={{ p: 3, border: '1px solid grey', borderRadius: '15px', m: 1 }}
            >
              <Box gridColumn="span 3">
                <Field.Select name={`salary[${index}].vehicleType`} label="Vehicle Type">
                  <MenuItem value="">None</MenuItem>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {vehicleTypes.map(({ value, key }) => (
                    <MenuItem key={key} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Box>

              <Box gridColumn="span 3">
                <Field.Text
                  name={`salary[${index}].fixedSalary`}
                  label="Fixed Salary"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                  }}
                />
              </Box>
              <Box gridColumn="span 3">
                <Field.Text
                  name={`salary[${index}].percentageSalary`}
                  label="Percentage Salary"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Box>

              <Box gridColumn="span 2">
                <Field.Text
                  name={`salary[${index}].fixMilage`}
                  label="Fix Milage"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">KM/Ltr</InputAdornment>,
                  }}
                />
              </Box>
              <Box gridColumn="span 3">
                <Field.Text
                  name={`salary[${index}].performanceMilage`}
                  label="Performance Milage"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">KM/Ltr</InputAdornment>,
                  }}
                />
              </Box>
              <Box gridColumn="span 3">
                <Field.Text
                  name={`salary[${index}].advanceAmt`}
                  label="Advance Amount"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                  }}
                />
              </Box>
              <Box gridColumn="span 3">
                <Field.Text
                  name={`salary[${index}].diesel`}
                  label="Diesel"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Ltr</InputAdornment>,
                  }}
                />
              </Box>
              <Box gridColumn="span 2">
                <Field.Text
                  name={`salary[${index}].adBlue`}
                  label="Adblue"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Ltr</InputAdornment>,
                  }}
                />
              </Box>

              <Box gridColumn="span 1" display="flex" justifyContent="center" alignItems="center">
                <Button
                  size="small"
                  color="error"
                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  onClick={() => handleRemoveSalary(index)}
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
          onClick={handleAddSalary}
          sx={{ mt: 3 }}
        >
          Add Vehicle Type
        </Button>
      </Card>
    </>
  );

  const renderActions = () => (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!currentRoute ? 'Create Route' : 'Save Changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderCustomerField()}
          {renderRouteDetails()}
          {renderSalaryFields()}
          {renderActions()}
        </Grid>
      </Grid>
    </Form>
  );
}
