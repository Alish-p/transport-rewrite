import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function DieselPriceDetailView({ dieselPrice }) {
  const [tabValue, setTabValue] = useState('details');

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const { price, startDate, endDate, pump } = dieselPrice || {};

  const detailsMarkdown = `
[](/)
**Price:** ${price}  
**Valid From Date:** ${fDate(startDate)}  
**Valid Till Date:** ${fDate(endDate)}  

---

### Pump Information

| Attribute            | Details                  |
| :------------------- | :----------------------- |
| **Pump Name**        | ${pump?.pumpName}              |
| **Location**         | ${pump?.address}              |

`;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Diesel Price Info"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Diesel Prices List', href: paths.dashboard.dieselPrice.root },
          { name: `${pump?.pumpName}` },
        ]}
        sx={{ my: { xs: 3, md: 5 } }}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.dieselPrice.edit(dieselPrice._id)}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Edit Diesel Price
          </Button>
        }
      />
      <Card>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.grey['500Channel']}`,
          }}
        >
          <Tab value="details" label="Diesel Price Details" />
        </Tabs>

        {tabValue === 'details' && (
          <Box sx={{ p: 3 }}>
            <Markdown children={detailsMarkdown} />
          </Box>
        )}
      </Card>
    </DashboardContent>
  );
}
