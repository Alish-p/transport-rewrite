import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { HeroHeader } from 'src/components/hero-header-card';

export function PartDetailView({ part }) {
  const {
    name,
    partNumber,
    category,
    manufacturer,
    description,
    unitCost,
    measurementUnit,
    quantity,
    inventoryLocation,
  } = part || {};

  return (
    <DashboardContent>
      <HeroHeader
        offsetTop={70}
        title={name || partNumber}
        status="Active"
        icon="mdi:cog-outline"
        meta={[
          { icon: 'mdi:format-list-numbered', label: partNumber },
          { icon: 'mdi:label-outline', label: category },
          { icon: 'mdi:factory', label: manufacturer },
        ]}
      />

      <Box sx={{ mt: 3 }}>
        <Card>
          <CardHeader title="Part Details" />
          <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
            <DetailRow label="Part Number" value={partNumber} />
            <DetailRow label="Name" value={name} />
            <DetailRow label="Category" value={category} />
            <DetailRow label="Manufacturer" value={manufacturer} />
            <DetailRow label="Measurement Unit" value={measurementUnit} />
            <DetailRow label="Quantity" value={quantity} />
            <DetailRow
              label="Unit Cost"
              value={unitCost != null ? `₹ ${Number(unitCost).toFixed(2)}` : undefined}
            />
            <DetailRow label="Location" value={inventoryLocation?.name} />
            <DetailRow
              label="Description"
              value={description}
              multiline
            />
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

