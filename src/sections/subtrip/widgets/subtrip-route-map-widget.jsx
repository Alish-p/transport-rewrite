import { useQuery } from '@tanstack/react-query';
import { Popup, Marker, TileLayer, MapContainer } from 'react-leaflet';

import { Box, Card, Stack, Alert, Divider, Tooltip, CardHeader, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
// Keeping the import to patch L.icon if not already done

function usePincodesCoordinates(pincode1, pincode2) {
  return useQuery({
    queryKey: ['nominatim', pincode1, pincode2],
    queryFn: async () => {
      const fetchCoords = async (pincode) => {
        if (!pincode) return null;
        const res = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`);
        const data = await res.json();
        if (data && Array.isArray(data) && data.length > 0) {
          return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
        return null;
      };

      const [coords1, coords2] = await Promise.all([
        fetchCoords(pincode1),
        fetchCoords(pincode2),
      ]);

      return { consignorCoords: coords1, consigneeCoords: coords2 };
    },
    enabled: Boolean(pincode1 || pincode2),
    staleTime: Infinity,
  });
}

function getBounds(coords1, coords2) {
  if (coords1 && coords2) {
    return [
      [coords1.lat, coords1.lng],
      [coords2.lat, coords2.lng],
    ];
  }
  return undefined;
}

export function SubtripRouteMapWidget({ payload }) {
  const consignorPincode = payload?.pincode_of_consignor;
  const consigneePincode = payload?.pincode_of_consignee;

  const { data, isLoading } = usePincodesCoordinates(consignorPincode, consigneePincode);

  // Removed early return so the widget is always visible

  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardHeader
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <Iconify icon="mdi:map-marker-distance" width={22} sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle1">Route Map</Typography>
            <Tooltip title="This data has been displayed from e-way bill" placement="top">
              <Box component="span" sx={{ display: 'inline-flex', color: 'text.secondary', cursor: 'pointer' }}>
                <Iconify icon="eva:info-outline" width={16} />
              </Box>
            </Tooltip>
          </Stack>
        }
        subheader={
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            {/* Show Address */}
            <Stack spacing={1.5} sx={{ mb: 1 }}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Iconify icon="mdi:transfer-up" width={18} sx={{ color: 'text.secondary', mt: 0.3 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.primary">Origin</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {payload?.legal_name_of_consignor && <strong>{payload.legal_name_of_consignor}<br /></strong>}
                    {[payload?.address1_of_consignor, payload?.address2_of_consignor].filter(Boolean).join(', ')}
                    {([payload?.address1_of_consignor, payload?.address2_of_consignor].filter(Boolean).length > 0) && <br />}
                    {payload?.place_of_consignor && `${payload.place_of_consignor}, `}{payload?.actual_from_state_name || payload?.state_of_consignor} - {payload?.pincode_of_consignor}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Iconify icon="mdi:transfer-down" width={18} sx={{ color: 'text.secondary', mt: 0.3 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.primary">Destination</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {payload?.legal_name_of_consignee && <strong>{payload.legal_name_of_consignee}<br /></strong>}
                    {[payload?.address1_of_consignee, payload?.address2_of_consignee].filter(Boolean).join(', ')}
                    {([payload?.address1_of_consignee, payload?.address2_of_consignee].filter(Boolean).length > 0) && <br />}
                    {payload?.place_of_consignee && `${payload.place_of_consignee}, `}{payload?.actual_to_state_name || payload?.state_of_supply} - {payload?.pincode_of_consignee}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            {/* Show distance and timeframe */}
            <Stack direction="row" spacing={3}>
              {payload?.transportation_distance ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="mdi:road-variant" width={16} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {payload.transportation_distance} KM
                  </Typography>
                </Stack>
              ) : null}
              {payload?.number_of_valid_days ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="mdi:clock-outline" width={16} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Takes less than {payload.number_of_valid_days} Days
                  </Typography>
                </Stack>
              ) : null}
            </Stack>
          </Stack>
        }
      />
      <Divider sx={{ mt: 2 }} />
      <Box sx={{ p: 2, height: 360 }}>
        {isLoading ? (
          <Typography variant="body2" color="text.secondary">Loading map...</Typography>
        ) : (!consignorPincode && !consigneePincode) || (!data?.consignorCoords && !data?.consigneeCoords) ? (
          <Alert severity="error" variant="outlined">
            cant find location on map
          </Alert>
        ) : (
          <Box sx={{ height: '100%', borderRadius: 1, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
            <MapContainer
              bounds={getBounds(data.consignorCoords, data.consigneeCoords)}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
              zoom={data.consignorCoords && data.consigneeCoords ? undefined : 13}
              center={
                data.consignorCoords && data.consigneeCoords
                  ? undefined
                  : (data.consignorCoords || data.consigneeCoords)
                    ? [(data.consignorCoords || data.consigneeCoords).lat, (data.consignorCoords || data.consigneeCoords).lng]
                    : [0, 0]
              }
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {data?.consignorCoords && (
                <Marker position={[data.consignorCoords.lat, data.consignorCoords.lng]}>
                  <Popup>
                    Consignor Location <br />
                    {payload?.place_of_consignor && `${payload?.place_of_consignor}, `}
                    {payload?.actual_from_state_name || payload?.state_of_consignor}
                  </Popup>
                </Marker>
              )}
              {data?.consigneeCoords && (
                <Marker position={[data.consigneeCoords.lat, data.consigneeCoords.lng]}>
                  <Popup>
                    Consignee Location <br />
                    {payload?.place_of_consignee && `${payload?.place_of_consignee}, `}
                    {payload?.actual_to_state_name || payload?.state_of_supply}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </Box>
        )}
      </Box>
    </Card>
  );
}
