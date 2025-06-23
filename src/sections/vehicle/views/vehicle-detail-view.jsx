import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { VehicleBillingSummary } from '../widgets/vehicle-billing-summary';

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

  // API now returns only the vehicle object
  const vehicleInfo = vehicle || {};

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
  } = vehicleInfo;

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

      <Box
        sx={{
          mb: 5,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 3,
        }}
      >
        {VEHICLE_SUMMARY.map((item) => (
          <Card key={item.title} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main', mr: 2 }} />
              <Box sx={{ typography: 'h6' }}>{item.title}</Box>
            </Box>
            <Box sx={{ typography: 'body2', color: 'text.secondary' }}>{item.description}</Box>
          </Card>
        ))}
      </Box>

      <Card>
        <Box
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box>
            <Box sx={{ typography: 'h4', mb: 1 }}>{vehicleNo}</Box>
            <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
              {vehicleCompany} {modelType}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:file-text-fill" />}
              sx={{ mr: 1 }}
            >
              Download Report
            </Button>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.grey['500Channel']}`,
          }}
        >
          {[{ value: 'description', label: 'Vehicle Details', icon: 'mdi:truck-info' }].map(
            (tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={<Iconify icon={tab.icon} />}
                iconPosition="start"
              />
            )
          )}
        </Tabs>

        <Box sx={{ p: 3, minHeight: 400 }}>
          {tabValue === 'description' && (
            <Box>
              <Markdown children={description} />
            </Box>
          )}
        </Box>
      </Card>

      <VehicleBillingSummary vehicleId={vehicle._id} />
    </DashboardContent>
  );
}
