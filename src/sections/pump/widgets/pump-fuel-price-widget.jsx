import dayjs from 'dayjs';
import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { fCurrency } from 'src/utils/format-number';

import { bgGradient } from 'src/theme/styles';
import { useCurrentFuelPrice } from 'src/query/use-fuel-prices';

import { Iconify } from 'src/components/iconify';

function FuelPriceItem({
  title,
  price,
  unit = 'L',
  color = 'primary',
  icon = 'solar:gas-station-bold',
  sx,
  ...other
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        py: 1.5,
        px: 2,
        boxShadow: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: theme.palette[color].darker,
        bgcolor: theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            color: theme.palette[color].dark,
            ...bgGradient({
              direction: '135deg',
              startColor: `${alpha(theme.palette[color].dark, 0)} 0%`,
              endColor: `${alpha(theme.palette[color].dark, 0.24)} 100%`,
            }),
          }}
        >
          <Iconify icon={icon} width={22} />
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 'fontWeightSemiBold' }}>
          {title}
        </Typography>
      </Stack>

      <Box sx={{ textAlign: 'right', pl: 1 }}>
        <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'fontWeightBold' }}>
          {fCurrency(price || 0)}
        </Typography>
        {unit && (
          <Typography
            variant="caption"
            component="span"
            sx={{ ml: 0.5, opacity: 0.72, fontWeight: 'fontWeightMedium' }}
          >
            / {unit}
          </Typography>
        )}
      </Box>
    </Card>
  );
}

export function PumpDieselPriceWidget({ pumpId }) {
  const today = useMemo(() => dayjs().format(), []);

  const { data: dieselPriceOnDate } = useCurrentFuelPrice({
    pumpId,
    fuelType: 'Diesel',
    date: today,
  });

  const { data: petrolPriceOnDate } = useCurrentFuelPrice({
    pumpId,
    fuelType: 'Petrol',
    date: today,
  });

  const { data: cngPriceOnDate } = useCurrentFuelPrice({
    pumpId,
    fuelType: 'CNG',
    date: today,
  });

  return (
    <Stack spacing={1.5}>
      <FuelPriceItem
        title="Live Diesel Price"
        price={dieselPriceOnDate?.price}
        unit="L"
        color="info"
        icon="solar:gas-station-bold"
      />

      <FuelPriceItem
        title="Live Petrol Price"
        price={petrolPriceOnDate?.price}
        unit="L"
        color="success"
        icon="solar:gas-station-bold"
      />

      <FuelPriceItem
        title="Live CNG Price"
        price={cngPriceOnDate?.price}
        unit="Kg"
        color="warning"
        icon="solar:gas-station-bold"
      />
    </Stack>
  );
}

export default PumpDieselPriceWidget;
