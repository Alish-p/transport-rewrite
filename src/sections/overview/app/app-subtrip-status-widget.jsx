import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { useTabs } from 'src/hooks/use-tabs';

import { fShortenNumber } from 'src/utils/format-number';

import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'subtrips', label: 'Subtrips' },
  { value: 'emptySubtrips', label: 'Empty Subtrips' },
];

// ----------------------------------------------------------------------

export function AppSubtripStatusWidget({ title, subheader, list, ...other }) {
  const tabs = useTabs('subtrips');

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

      <Scrollbar sx={{ minHeight: 384 }}>
        <Box sx={{ p: 3, gap: 3, minWidth: 360, display: 'flex', flexDirection: 'column' }}>
          {list.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </Box>
      </Scrollbar>
    </Card>
  );
}

function Item({ item, sx, ...other }) {
  return (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', ...sx }} {...other}>
      <Avatar
        variant="rounded"
        src={item.shortcut}
        sx={{
          p: 1,
          width: 48,
          height: 48,
          bgcolor: 'background.neutral',
        }}
      />

      <div>
        <Box sx={{ mb: 1, gap: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" noWrap>
            {item.name}
          </Typography>
        </Box>

        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          divider={
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
          }
          sx={{ typography: 'caption' }}
        >
          <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
            {fShortenNumber(item.downloaded)}
          </Box>

        </Stack>
      </div>
    </Box>
  );
}
