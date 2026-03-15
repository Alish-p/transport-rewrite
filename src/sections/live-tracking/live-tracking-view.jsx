import L from 'leaflet';
import { useMemo, useState } from 'react';
import { Popup, Marker, TileLayer, MapContainer } from 'react-leaflet';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import { useAllGps } from 'src/query/use-gps';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

// ---------------------------------------------------------------------------
// Marker icons by status
// ---------------------------------------------------------------------------

const TRUCK_SVG = (color) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
  <g filter="url(#shadow)">
    <path fill="${color}" stroke="#fff" stroke-width="1" d="M18 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM8.5 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
    <path fill="${color}" stroke="#fff" stroke-width="0.8" d="M3 4h10v11H3V4Zm10 2h3l3 4v5h-2.5a2 2 0 0 0-3.5 0V6Z"/>
  </g>
  <defs>
    <filter id="shadow"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.3"/></filter>
  </defs>
</svg>`;

const createStatusIcon = (color) =>
  L.divIcon({
    className: 'custom-marker',
    html: TRUCK_SVG(color),
    iconSize: [32, 32],
    iconAnchor: [16, 28],
    popupAnchor: [0, -24],
  });

const ICONS_BY_STATUS = {
  running: createStatusIcon('#16a34a'),
  idle: createStatusIcon('#d97706'),
  stopped: createStatusIcon('#dc2626'),
  default: createStatusIcon('#6b7280'),
};

// Normalise Fleetx status → running | idle | stopped
// currentStatus can be: RUNNING, IDLE, STOPPED, UNREACHABLE, etc.
// status can be: "Ignition On", "Ignition Off", "Idle", etc.
function resolveStatus(vehicle) {
  const cs = (vehicle.currentStatus || '').toLowerCase();
  const st = (vehicle.status || '').toLowerCase();

  if (cs === 'running' || st.includes('ignition on') || cs.includes('moving')) return 'running';
  if (cs === 'idle' || st.includes('idle')) return 'idle';
  // everything else (STOPPED, UNREACHABLE, Ignition Off, etc.)
  return 'stopped';
}

function getMarkerIcon(resolved) {
  return ICONS_BY_STATUS[resolved] || ICONS_BY_STATUS.default;
}

function statusColor(resolved) {
  if (resolved === 'running') return 'success';
  if (resolved === 'idle') return 'warning';
  if (resolved === 'stopped') return 'error';
  return 'default';
}

function statusLabel(resolved) {
  if (resolved === 'running') return 'Running';
  if (resolved === 'idle') return 'Idle';
  if (resolved === 'stopped') return 'Stopped';
  return 'Unknown';
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function LiveTrackingView() {
  const { data, isLoading, isError, dataUpdatedAt } = useAllGps();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [search, setSearch] = useState('');

  // Convert object map → array
  const vehicles = useMemo(() => {
    if (!data) return [];
    return Object.entries(data)
      .map(([vehicleNumber, info]) => ({ vehicleNumber, ...info, _resolved: resolveStatus(info) }))
      .filter((v) => v.latitude && v.longitude);
  }, [data]);

  // Filtered list
  const filtered = useMemo(() => {
    if (!search) return vehicles;
    const q = search.toLowerCase();
    return vehicles.filter((v) => v.vehicleNumber.toLowerCase().includes(q));
  }, [vehicles, search]);

  // Stats
  const stats = useMemo(() => {
    const s = { total: vehicles.length, running: 0, idle: 0, stopped: 0 };
    vehicles.forEach((v) => {
      if (v._resolved === 'running') s.running += 1;
      else if (v._resolved === 'idle') s.idle += 1;
      else s.stopped += 1;
    });
    return s;
  }, [vehicles]);

  // Center on India by default
  const center = useMemo(() => {
    if (filtered.length === 0) return [22.5, 78.9];
    const lat = filtered.reduce((sum, v) => sum + v.latitude, 0) / filtered.length;
    const lng = filtered.reduce((sum, v) => sum + v.longitude, 0) / filtered.length;
    return [lat, lng];
  }, [filtered]);

  // Timestamp of last update
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—';

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  // -------------------------------------------------------------------
  // Map content (shared between normal & fullscreen)
  // -------------------------------------------------------------------
  const mapContent = (
    <>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.7)',
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {filtered.length === 0 && !isLoading ? (
        <EmptyContent
          filled
          title="No vehicles found"
          description={
            search
              ? 'No vehicles match your search.'
              : 'No GPS data available. Make sure GPS integration is enabled.'
          }
          imgUrl={`${CONFIG.site.basePath}/assets/illustrations/illustration-dashboard.webp`}
          sx={{ py: 10 }}
        />
      ) : (
        <MapContainer
          center={center}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((v) => (
            <Marker
              key={v.vehicleNumber}
              position={[v.latitude, v.longitude]}
              icon={getMarkerIcon(v._resolved)}
            >
              <Popup>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {v.vehicleNumber}
                    {v.vehicleName ? ` (${v.vehicleName})` : ''}
                  </Typography>
                  <Chip
                    label={statusLabel(v._resolved)}
                    color={statusColor(v._resolved)}
                    size="small"
                    variant="soft"
                    sx={{ mb: 0.5 }}
                  />
                  {v.speed != null && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      Speed: {v.speed} km/h
                    </Typography>
                  )}
                  {v.driverName && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      Driver: {v.driverName}
                    </Typography>
                  )}
                  {v.address && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      📍 {v.address}
                    </Typography>
                  )}
                  {v.totalOdometer != null && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      Odometer: {v.totalOdometer.toLocaleString()} km
                    </Typography>
                  )}
                  {v.fuel != null && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      Fuel: {v.fuel}
                    </Typography>
                  )}
                  {v.lastUpdatedAt && (
                    <Typography variant="caption" display="block" color="text.disabled" sx={{ mt: 0.5 }}>
                      Last seen: {new Date(v.lastUpdatedAt).toLocaleString()}
                    </Typography>
                  )}
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </>
  );

  // -------------------------------------------------------------------
  // Floating toolbar (used inside fullscreen)
  // -------------------------------------------------------------------
  const toolbar = (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      flexWrap="wrap"
      sx={{
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        zIndex: 1100,
        bgcolor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
        borderRadius: 1.5,
        px: 2,
        py: 1,
        boxShadow: 3,
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mr: 1 }}>
        Live Tracking
      </Typography>

      <Chip label={`Total: ${stats.total}`} variant="outlined" size="small" />
      <Chip icon={<Iconify icon="mdi:truck-check" width={16} />} label={`${stats.running}`} color="success" size="small" variant="soft" />
      <Chip icon={<Iconify icon="mdi:timer-sand" width={16} />} label={`${stats.idle}`} color="warning" size="small" variant="soft" />
      <Chip icon={<Iconify icon="mdi:truck-off-road" width={16} />} label={`${stats.stopped}`} color="error" size="small" variant="soft" />

      <TextField
        size="small"
        placeholder="Search vehicle..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ ml: 'auto', width: 200 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" width={18} />
            </InputAdornment>
          ),
        }}
      />

      <Tooltip title="Exit fullscreen">
        <IconButton onClick={() => setIsFullscreen(false)} size="small">
          <Iconify icon="mdi:fullscreen-exit" width={22} />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  // -------------------------------------------------------------------
  // Fullscreen mode
  // -------------------------------------------------------------------
  if (isFullscreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1300,
          bgcolor: 'background.default',
        }}
      >
        {toolbar}
        {mapContent}
      </Box>
    );
  }

  // -------------------------------------------------------------------
  // Normal mode
  // -------------------------------------------------------------------
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ md: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h4">Live Tracking</Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time GPS positions of your fleet • Auto-refreshes every 30s
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Chip label={`Total: ${stats.total}`} variant="outlined" size="small" />
          <Chip icon={<Iconify icon="mdi:truck-check" width={16} />} label={`Running: ${stats.running}`} color="success" size="small" variant="soft" />
          <Chip icon={<Iconify icon="mdi:timer-sand" width={16} />} label={`Idle: ${stats.idle}`} color="warning" size="small" variant="soft" />
          <Chip icon={<Iconify icon="mdi:truck-off-road" width={16} />} label={`Stopped: ${stats.stopped}`} color="error" size="small" variant="soft" />
          <Typography variant="caption" color="text.disabled" sx={{ pl: 1 }}>
            Updated {lastUpdated}
          </Typography>
          <Tooltip title="Fullscreen">
            <IconButton onClick={() => setIsFullscreen(true)} size="small">
              <Iconify icon="mdi:fullscreen" width={22} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search vehicle number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, maxWidth: 360 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" />
            </InputAdornment>
          ),
        }}
      />

      {/* Error */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to fetch GPS data. Please check that GPS integration is enabled for your tenant.
        </Alert>
      )}

      {/* Map */}
      <Card sx={{ position: 'relative', overflow: 'hidden', height: { xs: 500, md: 'calc(100vh - 280px)' } }}>
        {mapContent}
      </Card>
    </Box>
  );
}
