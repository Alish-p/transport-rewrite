// form
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// redux
import { dispatch } from 'src/redux/store';
import { addPump, updatePump } from 'src/redux/slices/pump';

import { toast } from 'src/components/snackbar';
// components
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewPumpSchema = zod.object({
  pumpName: zod.string().min(1, { message: 'Pump Name is required' }),
  placeName: zod.string().min(1, { message: 'Place Name is required' }),
  ownerName: zod.string().min(1, { message: 'Owner Name is required' }),
  ownerCellNo: zod.string().min(1, { message: 'Owner Cell No is required' }),
  pumpPhoneNo: zod.string().min(1, { message: 'Pump Phone No is required' }),
  taluk: zod.string().min(1, { message: 'Taluk is required' }),
  district: zod.string().min(1, { message: 'District is required' }),
  contactPerson: zod.string().min(1, { message: 'Contact Person is required' }),
  address: zod.string().min(1, { message: 'Address is required' }),
});

// ----------------------------------------------------------------------

export default function PumpForm({ currentPump }) {
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      pumpName: currentPump?.pumpName || '',
      placeName: currentPump?.placeName || '',
      ownerName: currentPump?.ownerName || '',
      ownerCellNo: currentPump?.ownerCellNo || '',
      pumpPhoneNo: currentPump?.pumpPhoneNo || '',
      taluk: currentPump?.taluk || '',
      district: currentPump?.district || '',
      contactPerson: currentPump?.contactPerson || '',
      address: currentPump?.address || '',
    }),

    [currentPump]
  );

  const methods = useForm({
    resolver: zodResolver(NewPumpSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      if (!currentPump) {
        await dispatch(addPump(data));
      } else {
        await dispatch(updatePump(currentPump._id, data));
      }
      reset();
      toast.success(!currentPump ? 'Pump added successfully!' : 'Pump edited successfully!');
      navigate(paths.dashboard.pump.list);
    } catch (error) {
      console.error(error);
    }
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
              <Field.Text name="pumpName" label="Pump Name" />
              <Field.Text name="placeName" label="Place Name" />
              <Field.Text name="ownerName" label="Owner Name" />
              <Field.Text name="ownerCellNo" label="Owner Cell No" />
              <Field.Text name="pumpPhoneNo" label="Pump Phone No" />
              <Field.Text name="taluk" label="Taluk" />
              <Field.Text name="district" label="District" />
              <Field.Text name="contactPerson" label="Contact Person" />
              <Field.Text name="address" label="Address" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentPump ? 'Create Pump' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
