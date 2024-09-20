import { z as zod } from 'zod';
// form
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, InputAdornment } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// redux
import { dispatch } from 'src/redux/store';
import { addDriver, updateDriver } from 'src/redux/slices/driver';

// components
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

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
  licenseFrom: zod.date({ required_error: 'License From date is required' }),
  licenseTo: zod.date({ required_error: 'License To date is required' }),
  aadharNo: zod
    .string()
    .min(1, { message: 'Aadhar No is required' })
    .regex(
      /(^[0-9]{4}[0-9]{4}[0-9]{4}$)|(^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|(^[0-9]{4}-[0-9]{4}-[0-9]{4}$)/,
      { message: 'Aadhar No must be a valid format' }
    ),
  guarantorName: zod.string().min(1, { message: 'Guarantor Name is required' }),
  guarantorCellNo: zod
    .string()
    .min(1, { message: 'Guarantor Cell No is required' })
    .regex(/^[0-9]{10}$/, { message: 'Guarantor Cell No must be exactly 10 digits' }),
  experience: zod
    .number({ required_error: 'Experience is required' })
    .min(0, { message: 'Experience must be at least 0 years' }),
  dob: zod.date({ required_error: 'Date of Birth is required' }),
  permanentAddress: zod.string().min(1, { message: 'Permanent Address is required' }),
  bankCd: zod.string().min(1, { message: 'Bank Code is required' }),
  accNo: zod
    .string()
    .min(1, { message: 'Account No is required' })
    .regex(/^[0-9]{9,18}$/, { message: 'Account No must be between 9 and 18 digits' }),
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
      licenseTo: currentDriver?.licenseTo ? new Date(currentDriver.licenseTo) : new Date(),
      aadharNo: currentDriver?.aadharNo || '',
      guarantorName: currentDriver?.guarantorName || '',
      guarantorCellNo: currentDriver?.guarantorCellNo || '',
      experience: currentDriver?.experience || 0,
      dob: currentDriver?.dob ? new Date(currentDriver.dob) : new Date(),
      permanentAddress: currentDriver?.permanentAddress || '',
      bankCd: currentDriver?.bankCd || '',
      accNo: currentDriver?.accNo || '',
    }),
    [currentDriver]
  );

  const methods = useForm({
    resolver: zodResolver(NewDriverSchema),
    defaultValues,
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
    const filtered = values.images && values.images?.filter((file) => file !== inputFile);
    setValue('images', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('images', []);
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
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
              </Stack>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
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
              <Field.Text name="driverName" label="Driver Name" />
              <Field.Text name="driverLicenceNo" label="Driver Licence No" />
              <Field.Text name="driverPresentAddress" label="Driver Present Address" />
              <Field.Text
                name="driverCellNo"
                label="Driver Cell No"
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91 - </InputAdornment>,
                }}
              />
              <Field.DatePicker name="licenseFrom" label="License From" />
              <Field.DatePicker name="licenseTo" label="License To" />
              <Field.Text name="aadharNo" label="Aadhar No" />
              <Field.Text name="guarantorName" label="Guarantor Name" />
              <Field.Text
                name="guarantorCellNo"
                label="Guarantor Cell No"
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91 - </InputAdornment>,
                }}
              />
              <Field.Text
                name="experience"
                label="Experience"
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">years</InputAdornment>,
                }}
              />
              <Field.DatePicker name="dob" label="Date of Birth" />
              <Field.Text name="permanentAddress" label="Permanent Address" />
              <Field.Text name="bankCd" label="Bank Code" />
              <Field.Text name="accNo" label="Account No" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentDriver ? 'Create Driver' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
