import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
// form
import { useForm, useFieldArray } from 'react-hook-form';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Button, MenuItem, Typography } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// redux
import { dispatch } from 'src/redux/store';
import { addRoute, updateRoute } from 'src/redux/slices/route';

// components
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { tripType } from './RouteTableConfig';
import { vehicleTypes } from '../vehicle/vehicle-config';
// ----------------------------------------------------------------------

export const NewRouteSchema = zod.object({
  routeName: zod.string().min(1, { message: 'Route Name is required' }),
  tollAmt: zod.number({ required_error: 'Toll Amount is required' }),
  fromPlace: zod.string().min(1, { message: 'From Place is required' }),
  toPlace: zod.string().min(1, { message: 'To Place is required' }),
  noOfDays: zod.number({ required_error: 'Number of Days is required' }),
  tripType: zod.string().min(1, { message: 'Trip Type is required' }),
  ratePerTon: zod.number({ required_error: 'Rate per Ton is required' }),
  distance: zod.number({ required_error: 'Distance is required' }),
  validFromDate: schemaHelper.date({ message: { required_error: 'From date is required!' } }),
  transportType: zod.string().min(1, { message: 'Transport Type is required' }),
  validTillDate: schemaHelper.date({ message: { required_error: 'Till date is required!' } }),
  salary: zod.array(
    zod.object({
      vehicleType: zod.string().min(1, { message: 'Vehicle Type is required' }),
      fixedSalary: zod.number().min(1, { message: 'Fixed Salary is required' }),
      percentageSalary: zod.number().min(1, { message: 'Percentage Salary is required' }),
      fixMilage: zod.number({ required_error: 'Fixed Milage is required' }),
      performanceMilage: zod.number({ required_error: 'Performance Milage is required' }),
      advanceAmt: zod.number({ required_error: 'Advance Amount is required' }),
      diesel: zod.number({ required_error: 'Diesel is required' }),
      adBlue: zod.number({ required_error: 'Ad Blue is required' }),
    })
  ),
});

export default function RouteForm({ currentRoute }) {
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      routeName: currentRoute?.routeName || '',
      tollAmt: currentRoute?.tollAmt || 0,
      fromPlace: currentRoute?.fromPlace || '',
      toPlace: currentRoute?.toPlace || '',
      noOfDays: currentRoute?.noOfDays || 0,
      tripType: currentRoute?.tripType || '',
      ratePerTon: currentRoute?.ratePerTon || 0,
      distance: currentRoute?.distance || 0,
      validFromDate: currentRoute?.validFromDate
        ? new Date(currentRoute?.validFromDate)
        : new Date(),
      transportType: currentRoute?.transportType || '',
      validTillDate: new Date(
        currentRoute?.validTillDate || new Date().setFullYear(new Date().getFullYear() + 1)
      ), // Default to 1 year in the future

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'salary',
  });

  const onSubmit = async (data) => {
    try {
      if (!currentRoute) {
        await dispatch(addRoute(data));
      } else {
        await dispatch(updateRoute(currentRoute._id, data));
      }
      reset();
      toast.success(!currentRoute ? 'Route added successfully!' : 'Route edited successfully!');
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

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
              <Field.Text name="routeName" label="Route Name" />
              <Field.Text name="tollAmt" label="Toll Amount" type="number" />

              <Field.Text name="fromPlace" label="From Place" />
              <Field.Text name="toPlace" label="To Place" />
              <Field.Text name="noOfDays" label="Number of Days" type="number" />

              <Field.Select native name="tripType" label="Trip Type">
                <option value="" />
                {tripType.map(({ key, value }) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field.Select>

              <Field.Text name="distance" label="Distance" type="number" />
              <Field.DatePicker name="validFromDate" label="Valid From Date" />
              <Field.Text name="transportType" label="Transport Type" />
              <Field.DatePicker name="validTillDate" label="Valid Till Date" />
            </Box>

            <Typography variant="h6" sx={{ color: 'text.disabled', mt: 3 }}>
              Salaries:
            </Typography>

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
                  sx={{ p: 2, border: '1px dashed grey', borderRadius: '15px', m: 5 }}
                >
                  <Box gridColumn="span 3">
                    <Field.Select name={`salary[${index}].vehicleType`} label="Vehicle Type">
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
                    />
                  </Box>
                  <Box gridColumn="span 3">
                    <Field.Text
                      name={`salary[${index}].percentageSalary`}
                      label="Percentage Salary"
                      type="number"
                    />
                  </Box>

                  <Box gridColumn="span 2">
                    <Field.Text
                      name={`salary[${index}].fixMilage`}
                      label="Fix Milage"
                      type="number"
                    />
                  </Box>
                  <Box gridColumn="span 3">
                    <Field.Text
                      name={`salary[${index}].performanceMilage`}
                      label="Performance Milage"
                      type="number"
                    />
                  </Box>
                  <Box gridColumn="span 3">
                    <Field.Text
                      name={`salary[${index}].advanceAmt`}
                      label="Advance Amtount"
                      type="number"
                    />
                  </Box>
                  <Box gridColumn="span 3">
                    <Field.Text name={`salary[${index}].diesel`} label="diesel" type="number" />
                  </Box>
                  <Box gridColumn="span 2">
                    <Field.Text name={`salary[${index}].adBlue`} label="Adblue" type="number" />
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
              Add Consignee
            </Button>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentRoute ? 'Create Route' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
