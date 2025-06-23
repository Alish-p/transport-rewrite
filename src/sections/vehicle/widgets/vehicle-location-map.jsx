import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { useGps } from 'src/query/use-gps';

import { MapWithMarker } from 'src/components/map';

export function VehicleLocationMap({ vehicleNo, isOwn }) {
  const { data, isLoading } = useGps(vehicleNo, { enabled: !!vehicleNo && isOwn });
  const lat = data?.latitude;
  const lng = data?.longitude;

  return (
    <Card>
      <CardHeader title="Vehicle Location" />
      <Box sx={{ height: 500, p: 2 }}>
        {lat && lng ? (
          <MapWithMarker lat={lat} lng={lng} zoom={15} />
        ) : (
          <Box sx={{ typography: 'body2', color: 'text.secondary', textAlign: 'center', mt: 5 }}>
            {isLoading ? 'Fetching location...' : 'Location unavailable'}
          </Box>
        )}
      </Box>
    </Card>
  );
}
