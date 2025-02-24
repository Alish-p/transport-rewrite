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

// Example component

// ----------------------------------------------------------------------

const VEHICLE_SUMMARY = [
  {
    title: 'High Capacity',
    description: 'Loading capacity of 32 tons, suitable for heavy-duty transport.',
    icon: 'solar:truck-outline',
  },
  {
    title: 'Fuel Efficiency',
    description: 'Equipped with a 322-liter BS4 engine for optimal performance.',
    icon: 'solar:gas-station-bold',
  },
  {
    title: 'Warranty',
    description: 'Vehicle covered under warranty until November 2025.',
    icon: 'solar:shield-check-bold',
  },
];

// ----------------------------------------------------------------------

export function VehicleDetailView({ vehicle }) {
  const [tabValue, setTabValue] = useState('description');

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const {
    vehicleNo,
    vehicleType,
    modelType,
    vehicleCompany,
    noOfTyres,
    chasisNo,
    engineNo,
    manufacturingYear,
    loadingCapacity,
    engineType,
    fuelTankCapacity,
    fromDate,
    toDate,
    transporter,
  } = vehicle || {};

  const description = `
[](/)
**Vehicle Number:** ${vehicleNo}  
**Vehicle Type:** ${vehicleType}  
**Model Type:** ${modelType}  
**Manufacturer:** ${vehicleCompany} 



###### Specifications
-  Number of Tyres: ${noOfTyres}
-  Chassis Number: ${chasisNo}
-  Engine Number: ${engineNo}
-  Engine Type: ${engineType}
-  Fuel Tank Capacity: ${fuelTankCapacity} Liters

---

###### Insurance Details:

| Attribute            | Details                |
| :------------------- | :--------------------- |
| Valid From           | ${fDate(fromDate)}     |
| Valid Until          | ${fDate(toDate)}       |
| Manufacturing Year   | ${manufacturingYear}   |
| Loading Capacity     | ${loadingCapacity}     |
| Transporter          | ${transporter?.transportName} |



`;

  const expensesMarkdown = `
  [](/)
### Vehicle Expenses
Below is a summary of recent expenses for this vehicle.

| Date          | Expense Type   | Description             | Amount   | Paid Through | Slip Number |
| :------------ | :-------------| :----------------------- | :------- | :----------- | :---------- |
| 01-Nov-2023   | Fuel           | Diesel - 100 Liters     | $500     | Online       | SL-001      |
| 05-Nov-2023   | Maintenance    | Oil Change              | $150     | Cash         | SL-002      |
| 10-Nov-2023   | Toll           | Toll Charges            | $50      | Online       | SL-003      |
| 15-Nov-2023   | Repair         | Brake Pad Replacement   | $300     | Bank Transfer| SL-004      |
| 20-Nov-2023   | Fuel           | Diesel - 150 Liters     | $750     | Online       | SL-005      |

---

For further details, please refer to the expense logs.
`;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Vehicle Info"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vehicles List', href: paths.dashboard.vehicle.root },
          { name: `${vehicleNo}` },
        ]}
        sx={{ my: { xs: 3, md: 5 } }}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.vehicle.edit(vehicle._id)}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Edit Vehicle
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
          {[
            { value: 'description', label: 'Description' },
            { value: 'expenses', label: 'Expense Details' },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabValue === 'description' && (
          <Box sx={{ p: 3 }}>
            <Markdown children={description} />
          </Box>
        )}

        {tabValue === 'expenses' && (
          <Box sx={{ p: 3 }}>
            <Markdown children={expensesMarkdown} />
          </Box>
        )}
      </Card>
    </DashboardContent>
  );
}
