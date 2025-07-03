import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { Table, Stack, TableRow, TableBody, TableCell, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { ACTIONS, PERMISSIONS } from './config';
import { useCreateUser, useUpdateUser } from '../../query/use-user';

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
  designation: zod.string().min(1, { message: 'Designation is required!' }),
  password: zod.string().min(6, { message: 'Password must be at least 6 characters long!' }),

  permissions: zod.object(
    Object.fromEntries(
      PERMISSIONS.map(({ name }) => [
        name,
        zod.object(Object.fromEntries(ACTIONS.map((action) => [action, zod.boolean()]))),
      ])
    )
  ),
});

// ----------------------------------------------------------------------

export function UserNewEditForm({ currentUser }) {
  const router = useRouter();

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      mobile: currentUser?.mobile || '',
      address: currentUser?.address || '',
      password: currentUser?.password || '',
      designation: currentUser?.designation || '',

      permissions: Object.fromEntries(
        PERMISSIONS.map(({ name }) => [
          name,
          Object.fromEntries(
            ACTIONS.map((action) => [action, currentUser?.permissions?.[name]?.[action] || false])
          ),
        ])
      ),
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
    handleSubmit,
    formState: { isSubmitting, },
  } = methods;


  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentUser) {
        await updateUser({ id: currentUser._id, data });
      } else {
        await createUser(data);
      }
      reset();
      router.push(paths.dashboard.user.list);
    } catch (error) {
      console.error(error);
    }
  });

  // Update the Grid containing permissions section
  const TABLE_HEAD = [
    { id: 'module', label: 'Module' },
    { id: 'create', label: 'Create', align: 'center' },
    { id: 'view', label: 'View', align: 'center' },
    { id: 'update', label: 'Update', align: 'center' },
    { id: 'delete', label: 'Delete', align: 'center' },
  ];

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
              <Field.Text name="designation" label="Designation" />
              <Field.Text
                name="password"
                label="Password"
                helperText="This is a temporary password. The user must change it after logging in."
              />
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3, mt: 3 }}>
            <Scrollbar>
              <Table sx={{ minWidth: 800 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />

                <TableBody>
                  {PERMISSIONS.map((permission) => (
                    <TableRow key={permission.name}>
                      <TableCell>
                        <ListItemText
                          primary={permission.subheader}
                          secondary={permission.caption}
                          primaryTypographyProps={{ typography: 'subtitle2', mb: 0.5 }}
                          secondaryTypographyProps={{
                            component: 'span',
                            sx: {
                              typography: 'caption',
                              color: 'text.secondary',
                            },
                          }}
                        />
                      </TableCell>
                      {ACTIONS.map((action) => (
                        <TableCell key={action} align="center">
                          <Field.Checkbox
                            name={`permissions.${permission.name}.${action}`}
                            label=""
                            sx={{ m: 0 }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </Card>
        </Grid>

        <Grid xs={12} md={12}>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!currentUser ? 'Create user' : 'Save changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
