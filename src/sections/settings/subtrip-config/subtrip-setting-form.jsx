import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SubtripGlobalSettingForm from './subtrip-global-setting-form';
import SubtripCustomerOverridesList from './subtrip-customer-overrides-list';

// ----------------------------------------------------------------------

export default function SubtripSettingForm() {
  const [currentTab, setCurrentTab] = useState('global');

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Stack spacing={3}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Subtrip Settings
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Configure default freight models, visible fields, required constraints, custom labels, and customer-specific overrides for Subtrips (Jobs).
            </Typography>
          </Box>

          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Tab label="Global Settings" value="global" />
            <Tab label="Customer Overrides" value="customer_overrides" />
          </Tabs>
        </Stack>
      </Card>

      <Box>
        {currentTab === 'global' && <SubtripGlobalSettingForm />}
        {currentTab === 'customer_overrides' && <SubtripCustomerOverridesList />}
      </Box>
    </Stack>
  );
}
