import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { InputAdornment } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

// User Schema Validation
export const UserSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Invalid email address!' }),
  mobile: schemaHelper.phoneNumber({
    message: {
      required_error: 'Mobile No is required',
      invalid_error: 'Mobile No must be exactly 10 digits',
    },
  }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  password: zod.string().min(6, { message: 'Password must be at least 6 characters long!' }),

  bankDetails: zod.object({
    name: zod.string().min(1, { message: 'Bank name is required!' }),
    branch: zod.string().min(1, { message: 'Branch is required!' }),
    ifsc: zod.string().min(1, { message: 'IFSC is required!' }),
    place: zod.string().min(1, { message: 'Place is required!' }),
    accNo: zod.string().min(1, { message: 'Account number is required!' }),
  }),

  permissions: zod.object({
    bank: zod.object({
      create: zod.boolean(),
      view: zod.boolean(),
      update: zod.boolean(),
      delete: zod.boolean(),
    }),
    customer: zod.object({
      create: zod.boolean(),
      view: zod.boolean(),
      update: zod.boolean(),
      delete: zod.boolean(),
    }),
    diesel: zod.object({
      create: zod.boolean(),
      view: zod.boolean(),
      update: zod.boolean(),
      delete: zod.boolean(),
    }),
    driver: zod.object({
      create: zod.boolean(),
      view: zod.boolean(),
      update: zod.boolean(),
      delete: zod.boolean(),
    }),
    trip: zod.object({
      create: zod.boolean(),
      view: zod.boolean(),
      update: zod.boolean(),
      delete: zod.boolean(),
    }),
    user: zod.object({
      create: zod.boolean(),
      view: zod.boolean(),
      update: zod.boolean(),
      delete: zod.boolean(),
    }),
    vehicle: zod.object({
      create: zod.boolean(),
      view: zod.boolean(),
      update: zod.boolean(),
      delete: zod.boolean(),
    }),
  }),
});

// ----------------------------------------------------------------------

export function UserNewEditForm({ currentUser }) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      mobile: currentUser?.mobile || '',
      address: currentUser?.address || '',
      password: '',

      bankDetails: {
        name: currentUser?.bankDetails?.name || '',
        branch: currentUser?.bankDetails?.branch || '',
        ifsc: currentUser?.bankDetails?.ifsc || '',
        place: currentUser?.bankDetails?.place || '',
        accNo: currentUser?.bankDetails?.accNo || '',
      },

      permissions: {
        bank: currentUser?.permissions?.bank || {
          create: false,
          view: false,
          update: false,
          delete: false,
        },
        customer: currentUser?.permissions?.customer || {
          create: false,
          view: false,
          update: false,
          delete: false,
        },
        diesel: currentUser?.permissions?.diesel || {
          create: false,
          view: false,
          update: false,
          delete: false,
        },
        driver: currentUser?.permissions?.driver || {
          create: false,
          view: false,
          update: false,
          delete: false,
        },
        trip: currentUser?.permissions?.trip || {
          create: false,
          view: false,
          update: false,
          delete: false,
        },
        user: currentUser?.permissions?.user || {
          create: false,
          view: false,
          update: false,
          delete: false,
        },
        vehicle: currentUser?.permissions?.vehicle || {
          create: false,
          view: false,
          update: false,
          delete: false,
        },
      },
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentUser ? 'Update success!' : 'Create success!');
      console.info('DATA', data);
      router.push(paths.dashboard.user.list);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label color="warning" sx={{ position: 'absolute', top: 24, right: 24 }}>
                active
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
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
              <Field.Text name="name" label="Full name" />
              <Field.Text name="email" label="Email address" />
              <Field.Text
                name="mobile"
                label="Mobile number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91 - </InputAdornment>,
                }}
              />
              <Field.Text name="address" label="Address" />
              <Field.Text
                name="password"
                label="Password"
                helperText="This is a temporary password. The user must change it after logging in."
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create user' : 'Save changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
