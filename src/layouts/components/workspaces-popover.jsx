import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

import { getTenantLogoUrl } from 'src/utils/tenant-branding';

import { Label } from 'src/components/label';

import { useTenantContext } from 'src/auth/tenant';

// ----------------------------------------------------------------------

export function WorkspacesPopover({ data = [], sx, ...other }) {
  const tenant = useTenantContext();

  const mediaQuery = 'sm';

  const workspace = {
    ...data[0],
    name: tenant?.name ?? data[0]?.name,
    plan: 'basic',
  };

  return (
    <ButtonBase
      sx={{
        py: 0.5,
        gap: { xs: 0.5, [mediaQuery]: 1 },
        ...sx,
      }}
      {...other}
    >
      <Box component="img" alt={workspace?.name} src={getTenantLogoUrl(tenant)} sx={{ width: 36, height: 36, borderRadius: '50%' }} />

      <Box
        component="span"
        sx={{
          typography: 'subtitle2',
          display: { xs: 'none', [mediaQuery]: 'inline-flex' },
        }}
      >
        {workspace?.name}
      </Box>

      <Label
        color={workspace?.plan === 'Free' ? 'default' : 'info'}
        sx={{
          height: 22,
          display: { xs: 'none', [mediaQuery]: 'inline-flex' },
        }}
      >
        {workspace?.plan}
      </Label>
    </ButtonBase>
  );
}
