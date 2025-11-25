import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Card,
  Stack,
  Divider,
  MenuItem,
  CardHeader,
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
  inventoryLocation: zod.string().min(1, { message: 'Inventory Location is required' }),
  quantity: zod
    .number({ required_error: 'Quantity is required' })
    .min(0, { message: 'Quantity cannot be negative' }),
});

export default function PartForm({ currentPart }) {
  const navigate = useNavigate();

  const createPart = useCreatePart();
  const updatePart = useUpdatePart();

  const defaultValues = useMemo(
    () => ({
      partNumber: currentPart?.partNumber || '',
      name: currentPart?.name || '',
      description: currentPart?.description || '',
      category: currentPart?.category || '',
      manufacturer: currentPart?.manufacturer || '',
      photo: currentPart?.photo || '',
      unitCost: currentPart?.unitCost ?? 0,
      measurementUnit: currentPart?.measurementUnit || '',
      inventoryLocation: currentPart?.inventoryLocation?._id || '',
      quantity: currentPart?.quantity ?? 0,
    }),
    [currentPart]
  );

  const methods = useForm({
    resolver: zodResolver(PartSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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
      const payload = {
        ...data,
        inventoryLocation: data.inventoryLocation,
      };

      let saved;
      if (!currentPart) {
        saved = await createPart(payload);
      } else {
        saved = await updatePart({ id: currentPart._id, data: payload });
      }

      reset();
      navigate(paths.dashboard.part.details(saved._id));
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
        <Field.Text name="manufacturer" label="Manufacturer" />
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
        {!currentPart && (
          <Field.Text
            name="quantity"
            label="Initial Quantity"
            type="number"
            inputProps={{ min: 0, step: 1 }}
          />
        )}

        <Field.Select name="inventoryLocation" label="Inventory Location">
          {locations.map((loc) => (
            <MenuItem key={loc._id} value={loc._id}>
              {loc.name}
            </MenuItem>
          ))}
        </Field.Select>

        <Field.Text name="photo" label="Photo URL" placeholder="https://..." />
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
