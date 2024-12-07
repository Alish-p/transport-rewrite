import { z as zod } from 'zod';
// form
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
// @mui
import { Card, Grid, Stack, Divider, Typography, InputAdornment } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// redux
import { dispatch } from 'src/redux/store';
import { addDriver, updateDriver } from 'src/redux/slices/driver';

// components
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewDriverSchema = zod.object({
  driverName: zod.string().min(1, { message: 'Driver Name is required' }),
  images: zod.any().nullable(),
  driverLicenceNo: zod
    .string()
    .min(1, { message: 'Driver Licence No is required' })
    .regex(/^[A-Za-z]{2}[0-9]{13}$/, {
      message: 'Driver Licence No must be in the format: two letters followed by 13 digits',
    }),
  driverPresentAddress: zod.string().min(1, { message: 'Driver Present Address is required' }),
  driverCellNo: zod
    .string()
    .min(1, { message: 'Driver Cell No is required' })
    .regex(/^[0-9]{10}$/, { message: 'Driver Cell No must be exactly 10 digits' }),
  licenseFrom: schemaHelper.date({ message: { required_error: 'From date is required!' } }),
  licenseTo: schemaHelper.date({ message: { required_error: 'To date is required!' } }),
  aadharNo: zod
    .string()
    .min(1, { message: 'Aadhar No is required' })
    .regex(
      /(^[0-9]{4}[0-9]{4}[0-9]{4}$)|(^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|(^[0-9]{4}-[0-9]{4}-[0-9]{4}$)/,
      { message: 'Aadhar No must be a valid format ie (12 Digits)' }
    ),
  guarantorName: zod.string().min(1, { message: 'Guarantor Name is required' }),
  guarantorCellNo: zod
    .string()
    .min(1, { message: 'Guarantor Cell No is required' })
    .regex(/^[0-9]{10}$/, { message: 'Guarantor Cell No must be exactly 10 digits' }),
  experience: zod
    .number({ required_error: 'Experience is required' })
    .min(0, { message: 'Experience must be at least 0 years' }),
  dob: schemaHelper.date({ message: { required_error: 'Date of Birth is required!' } }),
  permanentAddress: zod.string().min(1, { message: 'Permanent Address is required' }),
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

export default function DriverForm({ currentDriver }) {
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      driverName: currentDriver?.driverName || '',
      images: currentDriver?.images || null,
      driverLicenceNo: currentDriver?.driverLicenceNo || '',
      driverPresentAddress: currentDriver?.driverPresentAddress || '',
      driverCellNo: currentDriver?.driverCellNo || '',
      licenseFrom: currentDriver?.licenseFrom ? new Date(currentDriver.licenseFrom) : new Date(),
      licenseTo: currentDriver?.licenseTo
        ? new Date(currentDriver.licenseTo)
        : new Date().setFullYear(new Date().getFullYear() + 2),
      aadharNo: currentDriver?.aadharNo || '',
      guarantorName: currentDriver?.guarantorName || '',
      guarantorCellNo: currentDriver?.guarantorCellNo || '',
      experience: currentDriver?.experience || 0,
      dob: currentDriver?.dob ? new Date(currentDriver.dob) : new Date(),
      permanentAddress: currentDriver?.permanentAddress || '',
      bankDetails: {
        bankCd: currentDriver?.bankDetails?.bankCd || '',
        bankBranch: currentDriver?.bankDetails?.bankBranch || '',
        ifscCode: currentDriver?.bankDetails?.ifscCode || '',
        place: currentDriver?.bankDetails?.place || '',
        accNo: currentDriver?.bankDetails?.accNo || '',
      },
    }),
    [currentDriver]
  );

  const methods = useForm({
    resolver: zodResolver(NewDriverSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      if (!currentDriver) {
        await dispatch(addDriver(data));
      } else {
        await dispatch(updateDriver(currentDriver._id, data));
      }
      reset();
      toast.success(!currentDriver ? 'Driver added successfully!' : 'Driver edited successfully!');
      navigate(paths.dashboard.driver.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered = values.images && values.images.filter((file) => file !== inputFile);
    setValue('images', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('images', []);
  };

  const renderDriverDetails = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Driver Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Field.Text name="driverName" label="Driver Name" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.Text name="driverLicenceNo" label="Driver Licence No" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.Text name="driverPresentAddress" label="Driver Present Address" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.Text
            name="driverCellNo"
            label="Driver Cell No"
            InputProps={{
              startAdornment: <InputAdornment position="start">+91 - </InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.DatePicker name="licenseFrom" label="License From" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.DatePicker name="licenseTo" label="License To" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.Text name="aadharNo" label="Aadhar No" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.Text name="guarantorName" label="Guarantor Name" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.Text
            name="guarantorCellNo"
            label="Guarantor Cell No"
            InputProps={{
              startAdornment: <InputAdornment position="start">+91 - </InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.Text
            name="experience"
            label="Experience"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">years</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.DatePicker name="dob" label="Date of Birth" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.Text name="permanentAddress" label="Permanent Address" />
        </Grid>
      </Grid>
    </Card>
  );

  const renderBankDetails = () => (
    <Card sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" gutterBottom>
        Bank Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Field.Text name="bankDetails.bankCd" label="Bank Code" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.Text name="bankDetails.bankBranch" label="Bank Branch" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.Text name="bankDetails.ifscCode" label="IFSC Code" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.Text name="bankDetails.place" label="Place" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Field.Text name="bankDetails.accNo" label="Account No" />
        </Grid>
      </Grid>
    </Card>
  );

  const renderImages = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Images
      </Typography>
      <Field.Upload
        multiple
        thumbnail
        name="images"
        maxSize={3145728}
        onDrop={handleDrop}
        onRemove={handleRemoveFile}
        onRemoveAll={handleRemoveAllFiles}
        onUpload={() => console.log('ON UPLOAD')}
      />
    </Card>
  );

  const renderActions = () => (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!currentDriver ? 'Create Driver' : 'Save Changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {renderImages()}
        </Grid>
        <Grid item xs={12} md={8}>
          {renderDriverDetails()}
          {renderBankDetails()}
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {renderActions()}
    </Form>
  );
}
