import { z as zod } from 'zod';
// form
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Divider,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// redux
import { dispatch } from 'src/redux/store';
import { addDriver, updateDriver } from 'src/redux/slices/driver';

// components
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useRouter } from '../../routes/hooks';
import { Iconify } from '../../components/iconify';
import { useBoolean } from '../../hooks/use-boolean';
import { validateBankSelection } from '../bank/BankConfig';
import { BankListDialog } from '../bank/bank-list-dialogue';

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
  guarantorName: zod.string().min(1, { message: 'Guarantor Name is required' }),
  guarantorCellNo: schemaHelper.phoneNumber({
    message: {
      required_error: 'Guarantor Mobile No is required',
      invalid_error: 'Guarantor Mobile No must be exactly 10 digits',
    },
  }),
  experience: zod
    .number({ required_error: 'Experience is required' })
    .min(0, { message: 'Experience must be at least 0 years' }),
  dob: schemaHelper.date({ message: { required_error: 'Date of Birth is required!' } }),
  permanentAddress: zod.string().min(1, { message: 'Permanent Address is required' }),
  isActive: zod.boolean().optional(),
  bankDetails: zod.object({
    name: zod.string().min(1, { message: 'Name is required' }),
    branch: zod.string().min(1, { message: 'Bank Detail is required' }),
    ifsc: zod.string().min(1, { message: 'IFSC Code is required' }),
    place: zod.string().min(1, { message: 'Place is required' }),
    accNo: zod
      .string()
      .min(1, { message: 'Account No is required' })
      .regex(/^[0-9]{9,18}$/, { message: 'Account No must be between 9 and 18 digits' }),
  }),
});

// ----------------------------------------------------------------------

export default function DriverForm({ currentDriver, bankList }) {
  const navigate = useNavigate();
  const router = useRouter();
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
      isActive: currentDriver?.isActive,
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

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  const { bankDetails } = values;

  const bankDialogue = useBoolean();

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
        </Box>
      </Card>
    </>
  );

  console.log({ errors });

  const renderBankDetails = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Bank Details
      </Typography>
      <Card sx={{ p: 1, mb: 1 }}>
        <Grid container spacing={1} my={1}>
          <Grid item xs={12} sm={6}>
            <Stack sx={{ width: 1 }}>
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  mb: 1,
                  border: '1px solid grey',
                  borderRadius: '10px',
                  cursor: 'pointer',

                  borderColor: errors.bankDetails?.branch?.message ? 'error.main' : 'text.disabled',
                }}
                p={1}
                onClick={bankDialogue.onTrue}
              >
                <Typography variant="subtitle2" sx={{ color: 'text.disabled', flexGrow: 1 }}>
                  Bank Details
                </Typography>
                <IconButton>
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
              </Stack>

              <Typography typography="caption" sx={{ color: 'error.main', px: 1 }}>
                {errors.bankDetails?.branch?.message}
              </Typography>

              <Stack direction="row" alignItems="center" sx={{ my: 1 }}>
                <Field.Text name="bankDetails.accNo" label="Account No" />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Divider orientation="vertical" />
          </Grid>

          <Grid item xs={12} sm={4}>
            {validateBankSelection(bankDetails) && (
              <Stack spacing={1} alignItems="center" mb={1}>
                <Typography variant="subtitle2">{bankDetails?.name}</Typography>
                <Typography variant="body2">{`${bankDetails?.branch} , ${bankDetails?.place} `}</Typography>
                <Typography variant="body2">{bankDetails?.ifsc}</Typography>
                <Typography variant="body2">{bankDetails?.accNo}</Typography>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Card>
    </>
  );

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
      </Form>

      {/* For Selection of bank */}
      <BankListDialog
        title="Banks"
        open={bankDialogue.value}
        onClose={bankDialogue.onFalse}
        selected={(selectedIfsc) => bankDetails?.ifsc === selectedIfsc}
        onSelect={(bank) => {
          setValue('bankDetails.branch', bank?.branch);
          setValue('bankDetails.ifsc', bank?.ifsc);
          setValue('bankDetails.place', bank?.place);
          setValue('bankDetails.name', bank?.name);
        }}
        list={bankList}
        action={
          <Button
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ alignSelf: 'flex-end' }}
            onClick={() => {
              router.push(paths.dashboard.bank.new);
            }}
          >
            New
          </Button>
        }
      />
    </>
  );
}
