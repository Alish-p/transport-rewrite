import { z as zod } from 'zod';
// form
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Button, Divider, Typography, InputAdornment } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useUpdateDriver, useCreateFullDriver } from 'src/query/use-driver';

// components
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { BankDetailsWidget } from 'src/components/bank/bank-details-widget';

// ----------------------------------------------------------------------

export const NewDriverSchema = zod.object({
  driverName: zod
    .string()
    .min(1, { message: 'Driver Name is required' })
    .regex(/^[^0-9]*$/, { message: 'Driver Name must not contain numbers' }),
  images: zod.any().nullable(),
  driverLicenceNo: zod
    .string()
    .min(1, { message: 'Driver Licence No is required' })
    .regex(/^[A-Za-z]{2}[0-9]{13}$/, {
      message: 'Driver Licence No must be in the format: two letters followed by 13 digits',
    }),
  driverPresentAddress: zod.string().min(1, { message: 'Driver Present Address is required' }),
  driverCellNo: schemaHelper.phoneNumber({
    message: {
      required_error: 'Driver Cell No is required',
      invalid_error: 'Driver Cell No must be exactly 10 digits',
    },
  }),
  licenseFrom: schemaHelper.date({ message: { required_error: 'From date is required!' } }),
  licenseTo: schemaHelper.date({ message: { required_error: 'To date is required!' } }),
  aadharNo: zod
    .string()
    .min(1, { message: 'Aadhar No is required' })
    .regex(
      /(^[0-9]{4}[0-9]{4}[0-9]{4}$)|(^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|(^[0-9]{4}-[0-9]{4}-[0-9]{4}$)/,
      { message: 'Aadhar No must be a valid format ie (12 Digits)' }
    ),
  guarantorName: zod.string().optional(),
  guarantorCellNo: zod.string().optional(),
  experience: zod
    .number({ required_error: 'Experience is required' })
    .min(0, { message: 'Experience must be at least 0 years' }),
  dob: schemaHelper.date({ message: { required_error: 'Date of Birth is required!' } }).optional(),
  permanentAddress: zod.string().min(1, { message: 'Permanent Address is required' }),
  isActive: zod.boolean().optional(),
  bankDetails: zod.object({
    name: zod.string().min(1, { message: 'Bank Name is required' }),
    branch: zod.string().min(1, { message: 'Branch is required' }),
    ifsc: zod.string().min(1, { message: 'IFSC is required' }),
    place: zod.string().min(1, { message: 'Place is required' }),
    accNo: schemaHelper.accountNumber({
      message: {
        required_error: 'Account number is required',
        invalid_error: 'Account number must be between 9 and 18 digits',
      },
    }),
  }),
});

// ----------------------------------------------------------------------

export default function DriverForm({ currentDriver }) {
  const navigate = useNavigate();
  const bankDialog = useBoolean();
  const createDriver = useCreateFullDriver();
  const updateDriver = useUpdateDriver();

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
      dob: currentDriver?.dob ? new Date(currentDriver.dob) : undefined,
      permanentAddress: currentDriver?.permanentAddress || '',
      isActive: currentDriver?.isActive ?? true,
      bankDetails: {
        name: currentDriver?.bankDetails?.name || '',
        ifsc: currentDriver?.bankDetails?.ifsc || '',
        place: currentDriver?.bankDetails?.place || '',
        branch: currentDriver?.bankDetails?.branch || '',
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

  const { reset, watch, setValue, handleSubmit, formState: { isSubmitting, errors } } = methods;

  const values = watch();



  const onSubmit = async (data) => {
    try {
      if (!currentDriver) {
        await createDriver(data);
      } else {
        console.log({ dataInOnSubmit: data });
        await updateDriver({ id: currentDriver._id, data });
      }
      reset();
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
    <>
      <Typography variant="h6" gutterBottom>
        Driver Details
      </Typography>
      <Card sx={{ p: 3, mb: 3 }}>
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap={3}
        >
          <Field.Text name="driverName" label="Driver Name" />
          <Field.Text name="driverLicenceNo" label="Driver Licence No" />
          <Field.Text
            name="driverCellNo"
            label="Driver Cell No"
            InputProps={{
              startAdornment: <InputAdornment position="start">+91 - </InputAdornment>,
            }}
          />
          <Field.Text name="driverPresentAddress" label="Driver Present Address" />
          <Field.Text name="permanentAddress" label="Permanent Address" />

          <Field.Text name="aadharNo" label="Aadhar No" />
          <Field.Text
            name="experience"
            label="Experience"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">years</InputAdornment>,
            }}
          />

          <Field.Text name="guarantorName" label="Guarantor Name (Optional)" />
          <Field.Text
            name="guarantorCellNo"
            label="Guarantor Cell No (Optional)"
            InputProps={{
              startAdornment: <InputAdornment position="start">+91 - </InputAdornment>,
            }}
          />

          <Field.DatePicker name="dob" label="Date of Birth (Optional)" />

          <Field.DatePicker name="licenseFrom" label="License From" />
          <Field.DatePicker name="licenseTo" label="License To" />
        </Box>
      </Card>
    </>
  );

  const renderBankDetails = () => {
    const bd = values?.bankDetails || {};
    const summary = bd?.name
      ? `${bd.name}${bd.branch ? ` • ${bd.branch}` : ''}${bd.place ? ` • ${bd.place}` : ''}${bd.accNo ? ` • A/C ${bd.accNo}` : ''}`
      : 'Add bank details';
    const hasError = Boolean(errors?.bankDetails);

    return (
      <>
        <Typography variant="h6" gutterBottom>
          Bank Details
        </Typography>
        <Card sx={{ p: 3, mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={bankDialog.onTrue}
            startIcon={<Iconify icon={bd?.name ? 'mdi:bank' : 'mdi:bank-outline'} />}
            sx={{
              height: 56,
              justifyContent: 'flex-start',
              typography: 'body2',
              borderColor: hasError ? 'error.main' : 'text.disabled',
              color: hasError ? 'error.main' : 'text.primary',
            }}
          >
            {summary}
          </Button>

          <BankDetailsWidget
            variant="dialog"
            title="Bank Details"
            open={bankDialog.value}
            onClose={bankDialog.onFalse}
            compact={false}
            fieldNames={{
              ifsc: 'bankDetails.ifsc',
              name: 'bankDetails.name',
              branch: 'bankDetails.branch',
              place: 'bankDetails.place',
              accNo: 'bankDetails.accNo',
            }}
          />
        </Card>
      </>
    );
  };

  const renderImages = () => (
    <Card sx={{ pt: 10, mt: 4, pb: 5, px: 3 }}>
      {currentDriver && (
        <Label
          color={values.isActive ? 'success' : 'error'}
          sx={{ position: 'absolute', top: 24, right: 24 }}
        >
          {values.isActive ? 'Active' : 'Disabled'}
        </Label>
      )}

      <Box sx={{ mb: 5 }}>
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
      </Box>

      {currentDriver && (
        <Field.Switch
          name="isActive"
          labelPlacement="start"
          label={
            <>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Driver is Active ?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                When disabled, this driver cannot be assigned to new trips, and no salary slips will
                be generated for this driver.
              </Typography>
            </>
          }
          sx={{ mx: 0, my: 1, width: 1, justifyContent: 'space-between' }}
        />
      )}
    </Card>
  );

  const renderActions = () => (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!currentDriver ? 'Create Driver' : 'Save Changes'}
      </LoadingButton>
    </Stack>
  );

  const renderDialogues = () => null; // Bank list dialog removed

  return (
    <>
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
        {renderDialogues()}
      </Form>

      {/* Bank selection dialog removed in favor of inline bank details widget */}
    </>
  );
}
