import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { HeroHeader } from 'src/components/hero-header-card';

export function PartLocationDetailView({ partLocation }) {
  const { name, address } = partLocation || {};

  return (
    <DashboardContent>
      <HeroHeader
        offsetTop={70}
        title={name}
        status="Active"
        icon="mdi:warehouse"
        meta={[{ icon: 'mdi:map-marker', label: address }]}
      />

      <Box sx={{ mt: 3 }}>
        <Card>
          <CardHeader title="Part Location Details" />
          <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
            <DetailRow label="Location Name" value={name} />
            <DetailRow label="Address" value={address} multiline />
          </Stack>
        </Card>
      </Box>
    </DashboardContent>
  );
}

function DetailRow({ label, value, multiline }) {
  return (
    <Stack direction="row" alignItems={multiline ? 'flex-start' : 'center'} spacing={1.5}>
      <Box
        component="span"
        sx={{ color: 'text.secondary', width: 180, flexShrink: 0, typography: 'subtitle2' }}
      >
        {label}
      </Box>
      <Typography sx={{ flexGrow: 1 }}>{value || '-'}</Typography>
    </Stack>
  );
}

