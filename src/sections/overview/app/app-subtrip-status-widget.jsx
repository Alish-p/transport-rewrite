import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { useTabs } from 'src/hooks/use-tabs';

import { fShortenNumber } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';

import { SUBTRIP_STATUS_COLORS } from '../../subtrip/constants';

// ----------------------------------------------------------------------

const STATUS_ORDER = [
  'in-queue',
  'loaded',
  'error',
  'received',
  'billed-pending',
  'billed-overdue',
  'billed-paid',
];

const STATUS_LABELS = {
  'in-queue': 'In-Queue',
  loaded: 'Loaded',
  error: 'Error',
  received: 'Received',
  'billed-pending': 'Billed Pending',
  'billed-overdue': 'Billed Overdue',
  'billed-paid': 'Billed Paid',
};

const STATUS_ICONS = {
  'in-queue': 'solar:sort-by-time-bold-duotone',
  loaded: 'mdi:truck',
  error: 'material-symbols:error-outline',
  received: 'material-symbols:call-received',
  'billed-pending': 'mdi:file-document-alert',
  'billed-overdue': 'mdi:file-document-alert-outline',
  'billed-paid': 'mdi:file-document-check',
};

const TABS = [
  { value: 'subtrips', label: 'Subtrips' },
  { value: 'emptySubtrips', label: 'Empty Subtrips' },
];

// ----------------------------------------------------------------------

export function AppSubtripStatusWidget({ title, subheader, summary = {}, ...other }) {
  const tabs = useTabs('subtrips');

  const data = tabs.value === 'subtrips' ? summary.loaded : summary.empty;

  const list = STATUS_ORDER.filter((status) => data && data[status] !== undefined).map(
    (status) => ({
      status,
      count: data[status],
    })
  );

  const renderTabs = (
    <CustomTabs
      value={tabs.value}
      onChange={tabs.onChange}
      variant="fullWidth"
      slotProps={{ tab: { px: 0 } }}
    >
      {TABS.map((tab) => (
        <Tab key={tab.value} value={tab.value} label={tab.label} />
      ))}
    </CustomTabs>
  );

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      {renderTabs}

      <Scrollbar sx={{ minHeight: 384, maxHeight: 384 }}>
        <Box sx={{ p: 3, gap: 3, minWidth: 360, display: 'flex', flexDirection: 'column' }}>
          {list.map((item) => (
            <Item key={item.status} status={item.status} count={item.count} />
          ))}
        </Box>
      </Scrollbar>
    </Card>
  );
}

function Item({ status, count, sx, ...other }) {
  const color = SUBTRIP_STATUS_COLORS[status] || 'primary';

  return (
    <Box
      role="button"
      sx={{
        gap: 2,
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    >
      <Avatar
        variant="rounded"
        sx={{
          p: 1,
          width: 48,
          height: 48,
          color: `${color}.main`,
          bgcolor: (theme) => varAlpha(theme.vars.palette[color].mainChannel, 0.08),
        }}
      >
        <Iconify icon={STATUS_ICONS[status]} width={24} />
      </Avatar>

      <div>
        <Box sx={{ mb: 1, gap: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" noWrap>
            {STATUS_LABELS[status]}
          </Typography>
        </Box>

        <Stack spacing={1} direction="row" alignItems="center" sx={{ typography: 'caption' }}>
          <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
            {fShortenNumber(count)}
          </Box>
        </Stack>
      </div>
    </Box>
  );
}
