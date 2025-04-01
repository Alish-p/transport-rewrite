import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Table,
  Paper,
  Button,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  InputAdornment,
  TableContainer,
} from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useCreateRoute, useUpdateRoute } from 'src/query/use-route';

// components
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import RouteConfigDialogue from './components/route-config-dialogue';
import { KanbanCustomerDialog } from '../kanban/components/kanban-customer-dialog';

// ----------------------------------------------------------------------

export const NewRouteSchema = zod
  .object({
    routeName: zod.string().min(1, { message: 'Route Name is required' }),
    fromPlace: zod.string().min(1, { message: 'From Place is required' }),
    toPlace: zod.string().min(1, { message: 'To Place is required' }),
    noOfDays: zod.number({ required_error: 'Number of Days is required' }),
    distance: zod.number({ required_error: 'Distance is required' }),
    isCustomerSpecific: zod.boolean(),
    customer: zod.string().optional(),
  })
  .refine((data) => !data.isCustomerSpecific || data.customer, {
    message: 'Customer is required when the Route is not Generic',
    path: ['customer'],
  });

export default function RouteForm({ currentRoute, customers }) {
  const navigate = useNavigate();
  const customerDialog = useBoolean(false);
  const [vehicleConfigs, setVehicleConfigs] = useState(currentRoute?.vehicleConfiguration || []);
  const [editingConfig, setEditingConfig] = useState(null);

  const createRoute = useCreateRoute();
  const updateRoute = useUpdateRoute();

  const defaultValues = useMemo(
    () => ({
      routeName: currentRoute?.routeName || '',
      fromPlace: currentRoute?.fromPlace || '',
      toPlace: currentRoute?.toPlace || '',
      noOfDays: currentRoute?.noOfDays || 0,
      distance: currentRoute?.distance || 0,
      isCustomerSpecific: currentRoute?.isCustomerSpecific || true,
      customer: currentRoute?.customer?._id || '',
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
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;

  const values = watch();
  const selectedCustomer = customers.find((c) => c._id === values.customer);

  const onSubmit = async (data) => {
    try {
      const submitData = {
        ...data,
        vehicleConfiguration: vehicleConfigs,
      };

      if (!currentRoute) {
        await createRoute(submitData);
      } else {
        await updateRoute({ id: currentRoute._id, data: submitData });
      }
      reset();
      navigate(paths.dashboard.route.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCustomerChange = (customer) => {
    setValue('customer', customer._id);
  };

  const handleAddConfig = (config) => {
    setVehicleConfigs((prev) => [...prev, config]);
  };

  const handleEditConfig = (config) => {
    setEditingConfig(config);
  };

  const handleUpdateConfig = (config) => {
    setVehicleConfigs((prev) =>
      prev.map((item, index) => (index === editingConfig.index ? config : item))
    );
    setEditingConfig(null);
  };

  const handleDeleteConfig = (index) => {
    setVehicleConfigs((prev) => prev.filter((_, i) => i !== index));
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

  const renderVehicleConfigs = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Vehicle Configurations</Typography>
        <RouteConfigDialogue
          onApply={handleAddConfig}
          editingConfig={editingConfig}
          onUpdate={handleUpdateConfig}
        />
      </Box>

      <Card sx={{ p: 3, mb: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vehicle Type & Tyres</TableCell>
                <TableCell>Toll Amount</TableCell>
                <TableCell>Driver Advance</TableCell>

                <TableCell>Fixed Salary</TableCell>
                <TableCell>Percentage</TableCell>
                <TableCell>Diesel</TableCell>
                <TableCell>AdBlue</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicleConfigs.map((config, index) => (
                <TableRow key={index}>
                  <TableCell>{`${config.vehicleType} [${config.noOfTyres}]`}</TableCell>
                  <TableCell>{config.tollAmt}</TableCell>
                  <TableCell>₹{config.advanceAmt}</TableCell>
                  <TableCell>₹{config.fixedSalary}</TableCell>
                  <TableCell>{config.percentageSalary}%</TableCell>
                  <TableCell>{config.diesel}L</TableCell>
                  <TableCell>{config.adBlue}L</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEditConfig({ ...config, index })}
                        >
                          <Iconify icon="material-symbols:edit" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteConfig(index)}
                        >
                          <Iconify icon="material-symbols:delete" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
          {renderVehicleConfigs()}
          {renderActions()}
        </Grid>
      </Grid>
    </Form>
  );
}
