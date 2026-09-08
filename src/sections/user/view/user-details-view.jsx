import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fToNow } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { HeroHeader } from 'src/components/hero-header-card';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  UserBankWidget,
  UserBasicWidget,
  UserAccountWidget,
  UserChangePasswordDialog,
} from '../widgets';

// ----------------------------------------------------------------------

export function UserDetailView({ user }) {
  const passwordDialog = useBoolean();

  const { name, email, mobile, address, designation, lastSeen, _id } = user || {};

  const metaItems = [
    email ? { icon: 'solar:letter-bold', label: email } : null,
    mobile ? { icon: 'solar:phone-bold', label: mobile } : null,
    address ? { icon: 'solar:map-point-bold', label: address } : null,
    {
      icon: 'solar:clock-circle-bold',
      label: lastSeen ? `Last seen: ${fToNow(lastSeen)} ago` : 'Last seen: Never',
    },
  ].filter(Boolean);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="User Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: name || 'Details' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <HeroHeader
        offsetTop={70}
        title={name || 'User Profile'}
        status={designation || 'Active User'}
        icon="solar:user-bold"
        meta={metaItems}
        action={
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:key-minimalistic-square-bold" />}
              onClick={passwordDialog.onTrue}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.4)',
                color: 'common.white',
                '&:hover': {
                  borderColor: 'common.white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Change Password
            </Button>

            <Button
              component={RouterLink}
              href={paths.dashboard.user.edit(_id)}
              variant="contained"
              startIcon={<Iconify icon="solar:pen-bold" />}
              sx={{
                bgcolor: 'common.white',
                color: 'primary.darker',
                '&:hover': {
                  bgcolor: 'grey.200',
                },
              }}
            >
              Edit User
            </Button>
          </Stack>
        }
      />

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <UserBasicWidget user={user} />
          </Grid>

          <Grid xs={12} md={4}>
            <UserAccountWidget user={user} />
          </Grid>

          <Grid xs={12} md={4}>
            <UserBankWidget user={user} />
          </Grid>
        </Grid>
      </Box>

      <UserChangePasswordDialog
        open={passwordDialog.value}
        onClose={passwordDialog.onFalse}
        user={user}
      />
    </DashboardContent>
  );
}

export default UserDetailView;
