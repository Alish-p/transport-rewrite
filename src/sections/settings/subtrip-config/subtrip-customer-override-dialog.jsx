import { z as zod } from 'zod';
import { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButton from '@mui/material/ToggleButton';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useCustomersSummary } from 'src/query/use-customer';
import { useGetFieldConfig, useUpsertCustomerOverride } from 'src/query/use-field-config';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const FIELDS_KEYS = [
  { key: 'invoiceNo', defaultLabel: 'Invoice No' },
  { key: 'ewayBill', defaultLabel: 'Eway Bill' },
  { key: 'ewayExpiryDate', defaultLabel: 'Eway Expiry Date' },
  { key: 'shipmentNo', defaultLabel: 'Shipment No' },
  { key: 'orderNo', defaultLabel: 'Order No' },
  { key: 'referenceSubtripNo', defaultLabel: 'Reference Job No' },
  { key: 'diNumber', defaultLabel: 'DI/DO No' },
  { key: 'consignee', defaultLabel: 'Consignee' },
  { key: 'loadingPoint', defaultLabel: 'Loading Point' },
  { key: 'unloadingPoint', defaultLabel: 'Unloading Point' },
  { key: 'materialType', defaultLabel: 'Material Type' },
  { key: 'grade', defaultLabel: 'Grade' },
  { key: 'quantity', defaultLabel: 'Quantity' },
  { key: 'remarks', defaultLabel: 'Remarks' },
];

const SubtripCustomerOverrideSchema = zod.object({
  customer: zod.any().nullable().refine((val) => val !== null, 'Customer is required'),
  fields: zod.record(
    zod.string(),
    zod.object({
      label: zod.string().min(1, 'Field label is required'),
      visibility: zod.enum(['required', 'optional', 'hidden']),
    })
  ),
});

export default function SubtripCustomerOverrideDialog({ open, onClose, override, existingCustomerIds }) {
  const isEdit = !!override;

  const { data: globalConfig, isLoading: isLoadingGlobal } = useGetFieldConfig('subtrip');
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomersSummary();
  const { upsertOverride, isUpdatingOverride } = useUpsertCustomerOverride();

  // Filter customers for dropdown: exclude existing overrides, but keep current customer if editing
  const filteredCustomers = useMemo(() => {
    if (!customersData) return [];
    return customersData.filter((customer) => {
      const isAlreadyOverridden = existingCustomerIds.includes(customer._id);
      const isCurrentCustomer = isEdit && (override.customerId?._id || override.customerId) === customer._id;
      return !isAlreadyOverridden || isCurrentCustomer;
    });
  }, [customersData, existingCustomerIds, override, isEdit]);

  const defaultValues = useMemo(() => {
    const fieldsInit = {};
    FIELDS_KEYS.forEach(({ key, defaultLabel }) => {
      // Use existing override fields, or fall back to global config, or fall back to default labels
      const overrideField = override?.fields?.[key] || {};
      const globalField = globalConfig?.fields?.[key] || {};

      fieldsInit[key] = {
        label: overrideField.label || globalField.label || defaultLabel,
        visibility: overrideField.visibility || globalField.visibility || 'optional',
      };
    });

    let selectedCustomer = null;
    if (isEdit && customersData) {
      const targetId = override.customerId?._id || override.customerId;
      selectedCustomer = customersData.find((c) => c._id === targetId) || {
        _id: targetId,
        customerName: override.customerId?.customerName || 'Selected Customer',
      };
    }

    return {
      customer: selectedCustomer,
      fields: fieldsInit,
    };
  }, [override, globalConfig, customersData, isEdit]);

  const methods = useForm({
    resolver: zodResolver(SubtripCustomerOverrideSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    reset,
  } = methods;

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const onSubmit = async (formData) => {
    const customerId = formData.customer?._id;
    if (!customerId) return;

    await upsertOverride({
      entity: 'subtrip',
      customerId,
      fields: formData.fields,
    });
    onClose();
  };

  const isLoading = isLoadingGlobal || isLoadingCustomers;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Customer Override' : 'Add Customer Override'}</DialogTitle>

      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ p: 3 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={3}>
              <Box>
                {isEdit ? (
                  <Field.Text
                    name="customer.customerName"
                    label="Customer"
                    disabled
                    fullWidth
                  />
                ) : (
                  <Field.Autocomplete
                    name="customer"
                    label="Select Customer"
                    placeholder="Search by customer name"
                    options={filteredCustomers}
                    getOptionLabel={(option) => option?.customerName || ''}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    fullWidth
                    autoHighlight
                  />
                )}
              </Box>

              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Customize Subtrip Fields for this Customer
              </Typography>

              <TableContainer sx={{ border: (theme) => `solid 1px ${theme.vars.palette.divider}`, borderRadius: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Field Name</TableCell>
                      <TableCell sx={{ minWidth: 200 }}>Custom Label</TableCell>
                      <TableCell align="right">Visibility</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {FIELDS_KEYS.map(({ key, defaultLabel }) => (
                      <TableRow key={key} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {defaultLabel}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {key}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Field.Text
                            name={`fields.${key}.label`}
                            size="small"
                            placeholder={defaultLabel}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Controller
                            name={`fields.${key}.visibility`}
                            control={control}
                            render={({ field }) => (
                              <ToggleButtonGroup
                                value={field.value}
                                exclusive
                                onChange={(event, newValue) => {
                                  if (newValue) {
                                    field.onChange(newValue);
                                  }
                                }}
                                size="small"
                                color="primary"
                              >
                                <ToggleButton value="required" sx={{ px: 1, py: 0.25, fontSize: '0.7rem' }}>
                                  Req
                                </ToggleButton>
                                <ToggleButton value="optional" sx={{ px: 1, py: 0.25, fontSize: '0.7rem' }}>
                                  Opt
                                </ToggleButton>
                                <ToggleButton value="hidden" sx={{ px: 1, py: 0.25, fontSize: '0.7rem' }}>
                                  Hide
                                </ToggleButton>
                              </ToggleButtonGroup>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isUpdatingOverride}
          >
            Save Override
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
