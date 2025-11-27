import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import {
  Card,
  Stack,
  Table,
  Button,
  Divider,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { getTenantLogoUrl } from 'src/utils/tenant-branding';

import { usePaginatedParts } from 'src/query/use-part';
import { useCreatePurchaseOrder } from 'src/query/use-purchase-order';
import { usePaginatedPartLocations } from 'src/query/use-part-location';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { useTenantContext } from 'src/auth/tenant';

import { KanbanPartsDialog } from '../kanban/components/kanban-parts-dialog';
import { KanbanVendorDialog } from '../kanban/components/kanban-vendor-dialog';

const PurchaseOrderLineSchema = zod.object({
  partId: zod.string().min(1, { message: 'Part is required' }),
  quantityOrdered: zod
    .number({ required_error: 'Quantity is required' })
    .min(1, { message: 'Quantity must be at least 1' }),
  unitCost: zod
    .number({ required_error: 'Unit cost is required' })
    .min(0, { message: 'Unit cost cannot be negative' }),
});

export const PurchaseOrderSchema = zod.object({
  vendorId: zod.string().min(1, { message: 'Vendor is required' }),
  partLocationId: zod.string().min(1, { message: 'Part Location is required' }),
  orderDate: schemaHelper.date().optional(),
  description: zod.string().optional(),
  discountType: zod.enum(['fixed', 'percentage']).default('fixed'),
  discount: zod
    .number({ invalid_type_error: 'Invalid discount' })
    .min(0, { message: 'Discount cannot be negative' }),
  shipping: zod
    .number({ invalid_type_error: 'Invalid shipping' })
    .min(0, { message: 'Shipping cannot be negative' }),
  taxType: zod.enum(['fixed', 'percentage']).default('fixed'),
  tax: zod
    .number({ invalid_type_error: 'Invalid tax' })
    .min(0, { message: 'Tax cannot be negative' }),
  lines: zod.array(PurchaseOrderLineSchema).min(1, { message: 'Add at least one line item' }),
});

export default function PurchaseOrderForm() {
  const navigate = useNavigate();
  const tenant = useTenantContext();

  const vendorDialog = useBoolean();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [activeLineId, setActiveLineId] = useState(null);
  const [lineParts, setLineParts] = useState({});
  const partDialog = useBoolean();
  const methods = useForm({
    resolver: zodResolver(PurchaseOrderSchema),
    defaultValues: {
      vendorId: '',
      partLocationId: '',
      orderDate: new Date(),
      description: '',
      discountType: 'fixed',
      discount: 0,
      shipping: 0,
      taxType: 'fixed',
      tax: 0,
      lines: [],
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({ name: 'lines', control });

  const values = watch();

  const { data: partsResponse } = usePaginatedParts(
    { page: 1, rowsPerPage: 1000 },
    { staleTime: 1000 * 60 * 10 }
  );
  const parts = partsResponse?.parts || partsResponse?.results || [];

  const { data: locationsResponse } = usePaginatedPartLocations(
    { page: 1, rowsPerPage: 1000 },
    { staleTime: 1000 * 60 * 10 }
  );
  const locations =
    locationsResponse?.locations ||
    locationsResponse?.partLocations ||
    locationsResponse?.results ||
    [];

  const createPurchaseOrder = useCreatePurchaseOrder();

  useEffect(() => {
    setLineParts((prev) => {
      let changed = false;
      const next = { ...prev };
      fields.forEach((field, index) => {
        const partId = values.lines?.[index]?.partId;
        if (partId && !next[field.id]) {
          const found = parts.find((p) => p._id === partId);
          if (found) {
            next[field.id] = found;
            changed = true;
          }
        }
      });
      return changed ? next : prev;
    });
  }, [fields, parts, values.lines]);

  const activeLineIndex = fields.findIndex((field) => field.id === activeLineId);

  const closePartDialog = () => {
    setActiveLineId(null);
    partDialog.onFalse();
  };

  const handlePartChange = (part) => {
    if (activeLineIndex === -1 || !part) {
      closePartDialog();
      return;
    }
    setValue(`lines.${activeLineIndex}.partId`, part._id, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`lines.${activeLineIndex}.unitCost`, part.unitCost ?? 0, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setLineParts((prev) => ({
      ...prev,
      [activeLineId]: part,
    }));
    closePartDialog();
  };

  const getLinePart = (fieldId, partId) => lineParts[fieldId] || parts.find((p) => p._id === partId) || null;

  const activeLineSelectedPart =
    activeLineIndex >= 0
      ? getLinePart(fields[activeLineIndex].id, values.lines?.[activeLineIndex]?.partId)
      : null;

  const handleRemoveLine = (index) => {
    const fieldId = fields[index]?.id;
    remove(index);
    if (fieldId) {
      setLineParts((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const computed = useMemo(() => {
    const subtotal = (values.lines || []).reduce(
      (acc, line) => acc + (line.quantityOrdered || 0) * (line.unitCost || 0),
      0
    );

    const discountAmount =
      values.discountType === 'percentage'
        ? (subtotal * (values.discount || 0)) / 100
        : values.discount || 0;

    const taxableBase = Math.max(subtotal - discountAmount, 0);

    const taxAmount =
      values.taxType === 'percentage'
        ? (taxableBase * (values.tax || 0)) / 100
        : values.tax || 0;

    const total = taxableBase + taxAmount + (values.shipping || 0);

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total,
    };
  }, [values]);

  const onSubmit = async (formData) => {
    try {
      const payload = {
        vendor: formData.vendorId,
        partLocation: formData.partLocationId,
        orderDate: formData.orderDate || undefined,
        description: formData.description || undefined,
        lines: formData.lines.map((l) => ({
          part: l.partId,
          quantityOrdered: l.quantityOrdered,
          unitCost: l.unitCost,
        })),
        discountType: formData.discountType,
        discount: formData.discount || 0,
        shipping: formData.shipping || 0,
        taxType: formData.taxType,
        tax: formData.tax || 0,
      };

      const po = await createPurchaseOrder(payload);
      navigate(paths.dashboard.purchaseOrder.details(po._id));
    } catch (error) {
      console.error(error);
    }
  };

  const renderHeader = (
    <Box sx={{ mb: 3 }}>
      <Box
        rowGap={3}
        display="grid"
        alignItems="center"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr auto' }}
        sx={{ mb: 3 }}
      >
        <Box
          component="img"
          alt="logo"
          src={getTenantLogoUrl(tenant)}
          sx={{ width: 60, height: 60, bgcolor: 'background.neutral', borderRadius: 1 }}
        />
        <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
          <Label variant="soft" color="warning">
            Draft
          </Label>
          <Typography variant="h6">Purchase Order</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {fDate(values.orderDate || dayjs().toDate())}
          </Typography>
        </Stack>
      </Box>

      <Stack
        spacing={{ xs: 3, md: 5 }}
        direction={{ xs: 'column', md: 'row' }}
        divider={<Divider flexItem orientation="vertical" sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack sx={{ width: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled', mb: 1 }}>
            From:
          </Typography>
          <Stack spacing={1}>
            <Typography variant="subtitle2">{tenant?.name}</Typography>
            <Typography variant="body2">{tenant?.address?.line1}</Typography>
            <Typography variant="body2">{tenant?.address?.line2}</Typography>
            <Typography variant="body2">{tenant?.address?.state}</Typography>
            <Typography variant="body2">Phone: {tenant?.contactDetails?.phone}</Typography>
          </Stack>
        </Stack>

        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
              To (Vendor):
            </Typography>
            <IconButton onClick={vendorDialog.onTrue}>
              <Iconify icon="mingcute:add-line" color="green" />
            </IconButton>
          </Stack>
          {selectedVendor ? (
            <Stack spacing={0.5}>
              <Typography variant="subtitle2">{selectedVendor.name}</Typography>
              <Typography variant="body2">{selectedVendor.address}</Typography>
              <Typography variant="body2">{selectedVendor.phone}</Typography>
            </Stack>
          ) : (
            <Typography typography="caption" sx={{ color: 'error.main' }}>
              Select a vendor
            </Typography>
          )}
        </Stack>
      </Stack>

      <Box
        sx={{
          my: 4,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        <Field.Select name="partLocationId" label="Part Location">
          {locations.map((loc) => (
            <MenuItem key={loc._id} value={loc._id}>
              {loc.name}
            </MenuItem>
          ))}
        </Field.Select>
        <Field.DatePicker name="orderDate" label="Issue Date" />
      </Box>

      <KanbanVendorDialog
        open={vendorDialog.value}
        onClose={vendorDialog.onFalse}
        selectedVendor={selectedVendor}
        onVendorChange={(vendor) => {
          setSelectedVendor(vendor || null);
          setValue('vendorId', vendor?._id || '');
        }}
      />
    </Box>
  );

  const renderLines = (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Line Items
      </Typography>
      {fields.length === 0 ? (
        <Box
          sx={{
            p: 2,
            borderRadius: 1,
            border: '1px dashed',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No line items added yet.
          </Typography>
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() =>
              append({ partId: '', quantityOrdered: 1, unitCost: 0 })
            }
          >
            Add Line
          </Button>
        </Box>
      ) : (
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Part</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Cost</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center" width={40}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((field, index) => {
                const line = values.lines?.[index] || {};
                const amount = (line.quantityOrdered || 0) * (line.unitCost || 0);
                return (
                  <TableRow key={field.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {(() => {
                        const selectedPart = getLinePart(field.id, line.partId);
                        const label = selectedPart
                          ? `${selectedPart.name}${selectedPart.partNumber ? ` (${selectedPart.partNumber})` : ''
                          }`
                          : '';
                        return (
                          <DialogSelectButton
                            onClick={() => {
                              setActiveLineId(field.id);
                              partDialog.onTrue();
                            }}
                            placeholder="Select a part to attach price"
                            selected={label}
                            iconName="mdi:cube"
                          />
                        );
                      })()}
                    </TableCell>
                    <TableCell align="right" sx={{ minWidth: 120 }}>
                      <Field.Number
                        name={`lines.${index}.quantityOrdered`}
                        label="Qty"
                        inputProps={{ min: 1 }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ minWidth: 140 }}>
                      <Field.Number
                        name={`lines.${index}.unitCost`}
                        label="Unit Cost"
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ minWidth: 120 }}>
                      <Typography variant="body2">{fCurrency(amount)}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => handleRemoveLine(index)}>
                        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}

              <TableRow>
                <TableCell colSpan={6}>
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={() =>
                      append({ partId: '', quantityOrdered: 1, unitCost: 0 })
                    }
                  >
                    Add Line
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  const renderSummary = (
    <Card
      sx={{
        bgcolor: 'background.neutral',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Cost Summary
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1.1fr 1.5fr 1.1fr', sm: '1fr 1.5fr 1fr' },
            columnGap: 2,
            rowGap: 2,
            mb: 2,
          }}
        >
          {/* Subtotal */}
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Subtotal
          </Typography>
          <Box />
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, textAlign: 'right', justifySelf: 'end' }}
          >
            {fCurrency(computed.subtotal)}
          </Typography>

          {/* Discount */}
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Discount
          </Typography>
          <Field.InputWithUnit
            name="discount"
            unitName="discountType"
            label=""
            placeholder={values.discountType === 'percentage' ? '0.00' : '0.00'}
            unitOptions={[
              { label: 'Percentage', value: 'percentage' },
              { label: 'Fixed', value: 'fixed' },
            ]}
            defaultUnit="fixed"
            textFieldProps={{
              size: 'small',
            }}
          />
          <Typography
            variant="body2"
            sx={{ color: 'success.main', fontWeight: 500, textAlign: 'right', justifySelf: 'end' }}
          >
            - {fCurrency(computed.discountAmount)}
          </Typography>

          {/* Shipping */}
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Shipping
          </Typography>
          <Field.Number
            name="shipping"
            placeholder="₹0.00"
            size="small"
            inputProps={{ min: 0, step: 0.01 }}
          />
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, textAlign: 'right', justifySelf: 'end' }}
          >
            {fCurrency(values.shipping || 0)}
          </Typography>

          {/* Tax */}
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Tax
          </Typography>
          <Field.InputWithUnit
            name="tax"
            unitName="taxType"
            label=""
            placeholder={values.taxType === 'percentage' ? '0.00' : '0.00'}
            unitOptions={[
              { label: 'Percentage', value: 'percentage' },
              { label: 'Fixed', value: 'fixed' },
            ]}
            defaultUnit="fixed"
            textFieldProps={{
              size: 'small',
            }}
          />
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, textAlign: 'right', justifySelf: 'end' }}
          >
            {fCurrency(computed.taxAmount)}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Total */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            pt: 1,
            pb: 0.5,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Total Amount
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
            }}
          >
            {fCurrency(computed.total)}
          </Typography>
        </Stack>
      </Box>
    </Card >
  );

  const renderDescription = (
    <Card
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Iconify icon="solar:document-text-bold-duotone" width={24} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Additional Notes
          </Typography>
        </Stack>
        <Field.Text
          name="description"
          multiline
          rows={8}
          placeholder="Add any additional notes, terms, or special instructions for this purchase order..."
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.neutral',
            }
          }}
        />
      </Box>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        {renderHeader}
        {renderLines}
        {values.lines?.length > 0 && (
          <Box
            sx={{
              mt: 4,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
            }}
          >
            {renderDescription}
            {renderSummary}
          </Box>
        )}
      </Card>

      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate(paths.dashboard.purchaseOrder.list)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
        >
          Create Purchase Order
        </Button>
      </Stack>

      <KanbanPartsDialog
        open={partDialog.value}
        onClose={closePartDialog}
        selectedPart={activeLineSelectedPart}
        onPartChange={handlePartChange}
      />
    </Form>
  );
}
