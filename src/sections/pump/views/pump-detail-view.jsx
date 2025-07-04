import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function PumpDetailView({ pump }) {
  const [tabValue, setTabValue] = useState('details');

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const {
    pumpName,
    placeName,
    ownerName,
    ownerCellNo,
    pumpPhoneNo,
    taluk,
    district,
    contactPerson,
    address,
  } = pump || {};

  const detailsMarkdown = `
[](/)
**Pump Name:** ${pumpName}  
**Place Name:** ${placeName}  

---

### Contact Information

| Attribute            | Details                  |
| :------------------- | :----------------------- |
| **Owner Name**       | ${ownerName}             |
| **Owner Cell Number**| ${ownerCellNo}           |
| **Pump Phone Number**| ${pumpPhoneNo}           |
| **Contact Person**   | ${contactPerson}         |

---

### Location Details

| Attribute            | Details                  |
| :------------------- | :----------------------- |
| **Taluk**            | ${taluk}                 |
| **District**         | ${district}              |
| **Address**          | ${address}               |

`;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Pump Info"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Pumps List', href: paths.dashboard.pump.root },
          { name: `${pumpName}` },
        ]}
        sx={{ my: { xs: 3, md: 5 } }}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.pump.edit(pump._id)}
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
          >
            Edit Pump
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
          <Tab value="details" label="Pump Details" />
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
