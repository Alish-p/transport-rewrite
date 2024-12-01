import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Markdown } from 'src/components/markdown';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Iconify } from '../../../components/iconify';
import { RouterLink } from '../../../routes/components';

export function RouteDetailView({ route }) {
  const [tabValue, setTabValue] = useState('details');

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const {
    _id,
    routeName,
    tollAmt,
    fromPlace,
    toPlace,
    noOfDays,
    salary,
    tripType,
    ratePerTon,
    distance,
    validFromDate,
    validTillDate,
    transportType,
  } = route || {};

  const detailsMarkdown = `
[](/)
**Route Name:** ${routeName}  
**Trip Type:** ${tripType}  

---

### Route Information

| Attribute          | Details                  |
| :----------------- | :----------------------- |
| **From Place**     | ${fromPlace}             |
| **To Place**       | ${toPlace}               |
| **Number of Days** | ${noOfDays}              |
| **Toll Amount**    | ${tollAmt}               |
| **Distance (KM)**  | ${distance}              |
| **Rate Per Ton**   | ${ratePerTon}            |
| **Transport Type** | ${transportType}         |
| **Valid From**     | ${fDate(validFromDate)}  |
| **Valid Till**     | ${fDate(validTillDate)}  |

---

### Salary Information

| Vehicle Type      | Fixed Salary | Percentage Salary | Fixed Mileage | Performance Mileage | Diesel | AdBlue | Advance Amount |
| :---------------- | :----------- | :---------------- | :------------ | :------------------ | :----- | :----- | :------------- |
${salary
  .map(
    (item) =>
      `| ${item.vehicleType} | ${item.fixedSalary} | ${item.percentageSalary}% | ${item.fixMilage} | ${item.performanceMilage} | ${item.diesel} | ${item.adBlue} | ${item.advanceAmt} |`
  )
  .join('\n')}

`;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Route Info"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Routes List', href: paths.dashboard.route.root },
          { name: `${routeName}` },
        ]}
        sx={{ my: { xs: 3, md: 5 } }}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.route.edit(_id)}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Edit Route
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
          <Tab value="details" label="Route Details" />
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
