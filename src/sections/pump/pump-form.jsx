// form
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Divider, Typography } from '@mui/material';

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
  bankDetails: zod.object({
    bankCd: zod.string().min(1, { message: 'Bank Code is required' }),
    bankBranch: zod.string().min(1, { message: 'Bank Branch is required' }),
    ifscCode: zod.string().min(1, { message: 'IFSC Code is required' }),
    place: zod.string().min(1, { message: 'Place is required' }),
    accNo: zod
      .string()
      .min(1, { message: 'Account No is required' })
      .regex(/^[0-9]{9,18}$/, { message: 'Account No must be between 9 and 18 digits' }),
  }),
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
      bankDetails: {
        bankCd: currentPump?.bankDetails?.bankCd || '',
        bankBranch: currentPump?.bankDetails?.bankBranch || '',
        ifscCode: currentPump?.bankDetails?.ifscCode || '',
        place: currentPump?.bankDetails?.place || '',
        accNo: currentPump?.bankDetails?.accNo || '',
      },
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

  // Separate render methods
  const renderPumpDetails = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Pump Details
      </Typography>
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
    </Card>
  );

  const renderBankDetails = () => (
    <Card sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Bank Details
      </Typography>
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        <Field.Text name="bankDetails.bankCd" label="Bank Code" />
        <Field.Text name="bankDetails.bankBranch" label="Bank Branch" />
        <Field.Text name="bankDetails.ifscCode" label="IFSC Code" />
        <Field.Text name="bankDetails.place" label="Place" />
        <Field.Text name="bankDetails.accNo" label="Account No" />
      </Box>
    </Card>
  );

  const renderActions = () => (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!currentPump ? 'Create Pump' : 'Save Changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderPumpDetails()}
          {renderBankDetails()}
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {renderActions()}
    </Form>
  );
}
