import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Stack,
  Alert,
  Divider,
  MenuItem,
  CardHeader,
  Typography,
  ListSubheader,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useCreatePart, useUpdatePart } from 'src/query/use-part';
import { usePaginatedPartLocations } from 'src/query/use-part-location';

import { Form, Field } from 'src/components/hook-form';

import { PART_CATEGORIES, MEASUREMENT_UNIT_GROUPS } from './part-constant';



export const PartSchema = zod.object({
  partNumber: zod.string().min(1, { message: 'Part Number is required' }),
  name: zod.string().min(1, { message: 'Name is required' }),
  description: zod.string().optional(),
  category: zod.string().optional(),
  manufacturer: zod.string().optional(),
  photo: zod.string().url({ message: 'Photo must be a valid URL' }).optional().or(zod.literal('')),
  unitCost: zod
    .number({ required_error: 'Unit Cost is required' })
    .min(0, { message: 'Unit Cost cannot be negative' }),
  measurementUnit: zod.string().min(1, { message: 'Measurement Unit is required' }),
  // For editing existing parts we still use single inventoryLocation + quantity.
  // For creating new parts we support multi-location creation and validate quantities manually,
  // sending `initialInventory` to the backend.
  // inventoryLocation: zod.string().min(1, { message: 'Inventory Location is required' }).optional(),
  quantity: zod
    .number({ required_error: 'Quantity is required' })
    .min(0, { message: 'Quantity cannot be negative' })
    .optional(),
});

export default function PartForm({ currentPart }) {
  const navigate = useNavigate();

  const createPart = useCreatePart();
  const updatePart = useUpdatePart();

  const defaultValues = useMemo(() => {
    const inventoryEntries = Array.isArray(currentPart?.inventory) ? currentPart.inventory : [];

    const locationQuantities = {};
    const locationThresholds = {};

    inventoryEntries.forEach((entry) => {
      const loc =
        entry.inventoryLocation && typeof entry.inventoryLocation === 'object'
          ? entry.inventoryLocation
          : null;
      const locId = loc?._id || entry.inventoryLocationId || entry.inventoryLocation;
      if (!locId) return;

      locationQuantities[locId] = entry.quantity ?? 0;
      locationThresholds[locId] = entry.threshold ?? 0;
    });

    return {
      partNumber: currentPart?.partNumber || '',
      name: currentPart?.name || '',
      description: currentPart?.description || '',
      category: currentPart?.category || '',
      manufacturer: currentPart?.manufacturer || '',
      photo: currentPart?.photo || '',
      unitCost: currentPart?.unitCost ?? 0,
      measurementUnit: currentPart?.measurementUnit || '',
      // Legacy single-location fields (no longer used in UI)
      inventoryLocation: currentPart?.inventoryLocation?._id || '',
      quantity: currentPart?.quantity ?? 0,
      // Multi-location fields
      inventoryLocationIds: [],
      locationQuantities,
      locationThresholds,
    };
  }, [currentPart]);

  const methods = useForm({
    resolver: zodResolver(PartSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    reset,
    watch,
    handleSubmit,
    getValues,
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  console.log({ errors })
  const measurementUnit = watch('measurementUnit');

  const { data: locationsResponse } = usePaginatedPartLocations(
    { page: 1, rowsPerPage: 1000 },
    { staleTime: 1000 * 60 * 10 }
  );

  const locations =
    locationsResponse?.locations ||
    locationsResponse?.partLocations ||
    locationsResponse?.results ||
    [];

  const onSubmit = async (data) => {
    try {
      const existingInventoryEntries = Array.isArray(currentPart?.inventory)
        ? currentPart.inventory
        : [];

      const locationQuantities = getValues('locationQuantities') || {};
      const locationThresholds = getValues('locationThresholds') || {};

      // Editing an existing part: update thresholds per location (quantities are read-only)
      if (currentPart) {
        const inventory = [];

        locations.forEach((loc) => {
          const locId = loc._id;

          const existing = existingInventoryEntries.find((entry) => {
            const entryLoc =
              entry.inventoryLocation && typeof entry.inventoryLocation === 'object'
                ? entry.inventoryLocation
                : null;
            const entryLocId = entryLoc?._id || entry.inventoryLocationId || entry.inventoryLocation;
            return entryLocId === locId;
          });

          const rawThreshold = locationThresholds[locId];
          const rawQty = locationQuantities[locId];

          const threshold =
            rawThreshold !== undefined && rawThreshold !== ''
              ? Number(rawThreshold)
              : existing?.threshold ?? 0;

          if (threshold < 0) {
            setError(`locationThresholds.${locId}`, {
              type: 'manual',
              message: 'Reorder point cannot be negative',
            });
            return;
          }

          const quantity =
            typeof (existing && existing.quantity) === 'number'
              ? existing.quantity
              : rawQty !== undefined && rawQty !== '' && !Number.isNaN(Number(rawQty))
                ? Number(rawQty)
                : 0;

          // Include this location if it already has inventory or the user set a threshold
          if (existing || (rawThreshold !== undefined && rawThreshold !== '')) {
            inventory.push({
              inventoryLocation: locId,
              quantity,
              threshold,
            });
          }
        });

        const {
          inventoryLocation: _inventoryLocation,
          quantity: _quantity,
          inventoryLocationIds: _,
          locationQuantities: __,
          locationThresholds: ___,
          ...base
        } = data;

        const payload = {
          ...base,
          inventory,
        };

        const saved = await updatePart({ id: currentPart._id, data: payload });
        reset();
        navigate(paths.dashboard.part.details(saved._id));
        return;
      }

      // Creating a new part:
      // Iterate over all available locations to find those with defined quantities
      const entries = [];

      locations.forEach((loc) => {
        const rawQty = locationQuantities[loc._id];
        const rawThreshold = locationThresholds[loc._id];

        // We include the location if the user has entered a quantity (including 0)
        if (rawQty !== undefined && rawQty !== '' && rawQty !== null) {
          const qty = Number(rawQty);
          const threshold = rawThreshold !== undefined && rawThreshold !== '' ? Number(rawThreshold) : 0;

          if (qty < 0) {
            setError(`locationQuantities.${loc._id}`, {
              type: 'manual',
              message: 'Quantity cannot be negative',
            });
            return;
          }

          if (threshold < 0) {
            setError(`locationThresholds.${loc._id}`, {
              type: 'manual',
              message: 'Reorder point cannot be negative',
            });
            return;
          }

          entries.push({
            inventoryLocation: loc._id,
            quantity: qty,
            threshold,
          });
        }
      });

      if (entries.length === 0) {
        setError('root', {
          type: 'manual',
          message: 'Please enter initial quantity for at least one location',
        });
        return;
      }

      const {
        inventoryLocation: _inventoryLocation,
        quantity: _quantity,
        inventoryLocationIds: _,
        locationQuantities: __,
        locationThresholds: ___,
        ...base
      } = data;

      const payload = {
        ...base,
        inventory: entries,
      };

      const created = await createPart(payload);

      reset();
      if (created?._id) {
        navigate(paths.dashboard.part.details(created._id));
      } else {
        navigate(paths.dashboard.part.list);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderDetails = (
    <Card>
      <CardHeader title="Part Details" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="partNumber" label="Part Number" />
        <Field.Text name="name" label="Name" />
        <Field.Select name="category" label="Category">
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {PART_CATEGORIES.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Field.Select>
        <Field.AutocompleteCreatable
          name="manufacturer"
          label="Manufacturer"
          optionsGroup="partManufacturer"
          visibleOptionCount={5}
        />
        <Field.Text
          name="description"
          label="Description"
          multiline
          rows={3}
        />
      </Stack>
    </Card>
  );

  const renderInventory = (
    <Card>
      <CardHeader title="Inventory & Pricing" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Select name="measurementUnit" label="Measurement Unit">
          {MEASUREMENT_UNIT_GROUPS.map((group) => [
            <ListSubheader
              key={`${group.label}-subheader`}
              disableSticky
              disableGutters
            >
              {group.label}
            </ListSubheader>,
            group.options.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            )),
          ])}
        </Field.Select>
        <Field.Text
          name="unitCost"
          label="Unit Cost"
          type="number"
          inputProps={{ min: 0 }}
          InputProps={{
            endAdornment: measurementUnit ? (
              <InputAdornment position="end">/ {measurementUnit}</InputAdornment>
            ) : undefined,
          }}
        />
        {!currentPart && errors.root && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.root.message}
          </Alert>
        )}

        <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
          {currentPart
            ? 'View current quantities and edit reorder points per location'
            : 'Configure initial quantities and reorder points per location'}
        </Typography>

        <Stack spacing={2}>
          {locations.map((loc) => (
            <Stack
              key={loc._id}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ sm: 'center' }}
              spacing={2}
              sx={(theme) => ({
                p: 2,
                borderRadius: 1.5,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.neutral',
              })}
            >
              <Box sx={{ flex: 1, minWidth: 160 }}>
                <Typography variant="subtitle2">{loc.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {loc.address || 'No address'}
                </Typography>
              </Box>

              <Field.Text
                name={`locationQuantities.${loc._id}`}
                label={currentPart ? 'Current Qty' : 'Initial Qty'}
                placeholder={currentPart ? undefined : '-'}
                type="number"
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { sm: 140 } }}
                disabled={!!currentPart}
              />

              <Field.Text
                name={`locationThresholds.${loc._id}`}
                label="Reorder Point"
                placeholder="-"
                type="number"
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { sm: 140 } }}
              />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!currentPart ? 'Create Part' : 'Save Changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}
        {renderInventory}
        {renderActions}
      </Stack>
    </Form>
  );
}
