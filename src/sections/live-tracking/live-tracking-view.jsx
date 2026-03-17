import L from 'leaflet';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Popup, Marker, useMap, TileLayer, MapContainer } from 'react-leaflet';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import { useAllGps } from 'src/query/use-gps';

import { Label } from 'src/components/label';
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

  if (cs === 'idle' || st.includes('idle')) return 'idle';

  // If ignition is on but the vehicle isn't moving, it's idle.
  if (st.includes('ignition on')) {
    if (vehicle.speed === 0 || vehicle.speed === '0') return 'idle';
    return 'running';
  }

  if (cs === 'running' || cs.includes('moving')) return 'running';

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
// Fly-to helper – lives inside <MapContainer> so it can call useMap()
// ---------------------------------------------------------------------------

function FlyToVehicle({ vehicle, markerRefs }) {
  const map = useMap();

  useEffect(() => {
    let timeout;

    if (vehicle) {
      map.flyTo([vehicle.latitude, vehicle.longitude], 16, { duration: 1.2 });

      // Open the marker popup after fly animation finishes
      timeout = setTimeout(() => {
        const ref = markerRefs.current?.[vehicle.vehicleNumber];
        if (ref) ref.openPopup();
      }, 1300);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [vehicle, map, markerRefs]);

  return null;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function LiveTrackingView() {
  const theme = useTheme();
  const { data, isLoading, isError, dataUpdatedAt } = useAllGps();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isListExpanded, setIsListExpanded] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const markerRefs = useRef({});

  // Convert object map → array
  const vehicles = useMemo(() => {
    if (!data) return [];
    return Object.entries(data)
      .map(([vehicleNumber, info]) => ({ vehicleNumber, ...info, _resolved: resolveStatus(info) }))
      .filter((v) => v.latitude && v.longitude);
  }, [data]);

  // Filtered list
  const filtered = useMemo(() => {
    let list = vehicles;
    if (statusFilter !== 'all') {
      list = list.filter((v) => v._resolved === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((v) => v.vehicleNumber.toLowerCase().includes(q));
    }
    return list;
  }, [vehicles, search, statusFilter]);

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

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: stats.total },
    { value: 'running', label: 'Running', color: 'success', count: stats.running },
    { value: 'idle', label: 'Idle', color: 'warning', count: stats.idle },
    { value: 'stopped', label: 'Stopped', color: 'error', count: stats.stopped },
  ];

  const renderTabs = (
    <Tabs
      value={statusFilter}
      onChange={(e, newValue) => setStatusFilter(newValue)}
      sx={{
        px: 2.5,
        boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
      }}
    >
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          label={tab.label}
          iconPosition="end"
          icon={
            <Label
              variant={((tab.value === 'all' || tab.value === statusFilter) && 'filled') || 'soft'}
              color={tab.color}
            >
              {tab.count}
            </Label>
          }
        />
      ))}
    </Tabs>
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  // -------------------------------------------------------------------
  // Map content (shared between normal & fullscreen)
  // -------------------------------------------------------------------
  const mapContent = (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        '& .leaflet-layer, & .leaflet-control-zoom-in, & .leaflet-control-zoom-out, & .leaflet-control-attribution':
        {
          filter: isDarkMode
            ? 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%) grayscale(60%)'
            : 'none',
        },
      }}
    >
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
          <FlyToVehicle vehicle={selectedVehicle} markerRefs={markerRefs} />
          {filtered.map((v) => (
            <Marker
              key={v.vehicleNumber}
              ref={(ref) => { if (ref) markerRefs.current[v.vehicleNumber] = ref; }}
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
                      Fuel: {v.fuel.toString().includes(' ') ? v.fuel : `${Math.round(parseFloat(String(v.fuel).replace(/[^\d.]/g, '')))} L`}
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

      {/* Overlay Vehicle List */}
      {filtered.length > 0 && (
        <Card
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 1000,
            width: { xs: 'calc(100% - 32px)', sm: 400 },
            maxHeight: isListExpanded ? '75%' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: theme.customShadows.z24,
            bgcolor: 'background.paper',
            transition: 'max-height 0.3s ease',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => setIsListExpanded(!isListExpanded)}
            sx={{
              p: 2,
              pb: isListExpanded ? 1.5 : 2,
              borderBottom: (t) => (isListExpanded ? `solid 1px ${t.palette.divider}` : 'none'),
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Vehicles List
              </Typography>
              <Chip
                label={filtered.length}
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: 11, fontWeight: 700 }}
              />
            </Stack>
            <IconButton size="small" sx={{ mr: -1 }}>
              <Iconify
                icon={isListExpanded ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-upward-fill'}
              />
            </IconButton>
          </Stack>
          
          {isListExpanded && (
            <Box
              sx={{ overflowY: 'auto', flexGrow: 1, p: 1 }}
            >
              <Stack spacing={1}>
                {filtered.map((v) => (
                  <Box
                    key={v.vehicleNumber}
                    onClick={() => setSelectedVehicle(v)}
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      bgcolor: selectedVehicle?.vehicleNumber === v.vehicleNumber
                        ? alpha(theme.palette.primary.main, 0.12)
                        : 'background.neutral',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: selectedVehicle?.vehicleNumber === v.vehicleNumber
                        ? `1.5px solid ${theme.palette.primary.main}`
                        : '1.5px solid transparent',
                      '&:hover': {
                        bgcolor: selectedVehicle?.vehicleNumber === v.vehicleNumber
                          ? alpha(theme.palette.primary.main, 0.16)
                          : 'action.hover',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">{v.vehicleNumber}</Typography>
                      <Chip
                        label={statusLabel(v._resolved)}
                        color={statusColor(v._resolved)}
                        size="small"
                        variant="soft"
                        sx={{ height: 20, fontSize: 10 }}
                      />
                    </Stack>
                    {v.address && (
                      <Stack direction="row" spacing={0.5} sx={{ mb: 0.5 }}>
                        <Iconify
                          icon="mingcute:location-fill"
                          width={14}
                          sx={{ color: 'text.disabled', flexShrink: 0, mt: 0.25 }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {v.address}
                        </Typography>
                      </Stack>
                    )}
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Iconify icon="solar:speedometer-bold" width={14} sx={{ color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">
                          {v.speed != null ? `${v.speed} km/h` : '—'}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Iconify icon="solar:gas-station-bold" width={14} sx={{ color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">
                          {v.fuel ? (v.fuel.toString().includes(' ') ? v.fuel : `${Math.round(parseFloat(String(v.fuel).replace(/[^\d.]/g, '')))} L`) : '—'}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Card>
      )}
    </Box>
  );

  // -------------------------------------------------------------------
  // Floating toolbar (used inside fullscreen)
  // -------------------------------------------------------------------
  const toolbar = (
    <Stack
      direction="column"
      sx={{
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        zIndex: 1100,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: theme.customShadows.z16,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, pb: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Live Tracking
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            size="small"
            placeholder="Search vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" width={18} />
                </InputAdornment>
              ),
            }}
          />

          <Tooltip title={isDarkMode ? 'Light map' : 'Dark map'}>
            <IconButton onClick={() => setIsDarkMode(!isDarkMode)} size="small">
              <Iconify
                icon={isDarkMode ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'}
                width={22}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="Exit fullscreen">
            <IconButton onClick={() => setIsFullscreen(false)} size="small" color="error">
              <Iconify icon="mdi:fullscreen-exit" width={22} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {renderTabs}
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
    <Box sx={{ pb: { xs: 2, md: 3 }, height: '100%' }}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ md: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3, px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 } }}
      >
        <Box>
          <Typography variant="h4">Live Tracking</Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="caption" color="text.disabled" sx={{ pl: 1, mr: 1 }}>
            Updated {lastUpdated}
          </Typography>
          <Tooltip title={isDarkMode ? 'Light map' : 'Dark map'}>
            <IconButton onClick={() => setIsDarkMode(!isDarkMode)} size="small">
              <Iconify
                icon={isDarkMode ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'}
                width={22}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fullscreen">
            <IconButton onClick={() => setIsFullscreen(true)} size="small">
              <Iconify icon="mdi:fullscreen" width={22} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Card sx={{ mx: { xs: 2, md: 3 }, mb: 3 }}>
        {renderTabs}

        <Stack sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search vehicle number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Card>

      {/* Error */}
      {isError && (
        <Alert severity="error" sx={{ mx: { xs: 2, md: 3 }, mb: 3 }}>
          Failed to fetch GPS data. Please check that GPS integration is enabled for your tenant.
        </Alert>
      )}

      {/* Map */}
      <Card sx={{ position: 'relative', overflow: 'hidden', height: { xs: 500, md: 'calc(100vh - 350px)' }, mx: { xs: 2, md: 3 } }}>
        {mapContent}
      </Card>
    </Box>
  );
}
