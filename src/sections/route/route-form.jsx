import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Stack,
  Table,
  Paper,
  Tooltip,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  CardHeader,
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
import { DialogSelectButton } from 'src/components/dialog-select-button';

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

export default function RouteForm({ currentRoute }) {
  const navigate = useNavigate();
  const customerDialog = useBoolean(false);

  const [vehicleConfigs, setVehicleConfigs] = useState(currentRoute?.vehicleConfiguration || []);
  const [editingConfig, setEditingConfig] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(currentRoute?.customer || null);

  const createRoute = useCreateRoute();
  const updateRoute = useUpdateRoute();

  const defaultValues = useMemo(
    () => ({
      routeName: currentRoute?.routeName || '',
      fromPlace: currentRoute?.fromPlace || '',
      toPlace: currentRoute?.toPlace || '',
      noOfDays: currentRoute?.noOfDays || 0,
      distance: currentRoute?.distance || 0,
      isCustomerSpecific: currentRoute?.isCustomerSpecific ?? true,
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
    formState: { isSubmitting, errors },
    watch,
    setValue,
  } = methods;

  const values = watch();

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
    setSelectedCustomer(customer);
    setValue('customer', customer._id);
  };

  const handleAddConfig = (config) => {
    const isDuplicate = vehicleConfigs.some(
      (c) => c.vehicleType === config.vehicleType && c.noOfTyres === config.noOfTyres
    );

    if (isDuplicate) {
      toast.error('Duplicate configuration for same vehicle type and tyre count');
      return;
    }
    setVehicleConfigs((prev) => [...prev, config]);
  };

  const handleEditConfig = (config) => {
    setEditingConfig(config);
  };

  const handleUpdateConfig = (updatedConfig) => {
    const isDuplicate = vehicleConfigs.some(
      (c, i) =>
        i !== editingConfig.index &&
        c.vehicleType === updatedConfig.vehicleType &&
        c.noOfTyres === updatedConfig.noOfTyres
    );

    if (isDuplicate) {
      toast.error('Duplicate configuration for same vehicle type and tyre count');
      return;
    }

    setVehicleConfigs((prev) =>
      prev.map((item, index) => (index === editingConfig.index ? updatedConfig : item))
    );

    setEditingConfig(null);
  };

  const handleDeleteConfig = (index) => {
    setVehicleConfigs((prev) => prev.filter((_, i) => i !== index));
  };

  const renderRouteDetails = () => (
    <Card>
      <CardHeader title="Route Details" sx={{ mb: 3 }} />
      <Divider />

      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
        spacing={3}
        sx={{ p: 3 }}
      >
        <Field.Text name="routeName" label="Route Name" required />

        <Field.Text name="fromPlace" label="From Place" required />
        <Field.Text name="toPlace" label="To Place" required />
        <Field.Text
          name="noOfDays"
          label="Number of Days"
          type="number"
          required
          InputProps={{
            endAdornment: <InputAdornment position="end">Days</InputAdornment>,
          }}
        />

        <Field.Text
          name="distance"
          label="Distance"
          type="number"
          required
          InputProps={{
            endAdornment: <InputAdornment position="end">KM</InputAdornment>,
          }}
        />
      </Box>
    </Card>
  );

  const renderCustomerField = () => (
    <>
      <Card>
        <CardHeader title="Customer Details" sx={{ mb: 3 }} />
        <Divider />

        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
          spacing={3}
          sx={{ p: 3 }}
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

              <DialogSelectButton
                onClick={customerDialog.onTrue}
                placeholder="Select Customer *"
                selected={selectedCustomer?.customerName}
                error={!!errors.customer?.message}
                iconName="mdi:office-building"
              />
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
    <Card >
      <CardHeader
        title="Vehicle Configurations"
        sx={{ mb: 3 }}
        action={
          <RouteConfigDialogue
            onApply={handleAddConfig}
            editingConfig={editingConfig}
            onUpdate={handleUpdateConfig}
          />
        }
      />
      <Divider />

      <TableContainer component={Paper} sx={{ py: 3, }}>
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
  );

  const renderActions = () => (
    <Stack alignItems="flex-end">
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!currentRoute ? 'Create Route' : 'Save Changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderCustomerField()}
        {renderRouteDetails()}
        {renderVehicleConfigs()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
