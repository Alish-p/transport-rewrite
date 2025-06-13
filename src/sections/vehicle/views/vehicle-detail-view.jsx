import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
// @mui
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const SUBTRIP_HEADS = [
  'Subtrip ID',
  'Driver',
  'Start Date',
  'Status',
  'Loading Point',
  'Unloading Point',
];

const EXPENSE_HEADS = ['Date', 'Type', 'Amount', 'Slip No'];

// ----------------------------------------------------------------------

export function VehicleDetailView({ vehicle }) {
  const [tabValue, setTabValue] = useState('description');

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  // The API returns { vehicle: { ...fields }, subtrips: [], expenses: [] }
  const { vehicle: vehicleInfo = {}, subtrips = [], expenses = [] } = vehicle || {};

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
          {[
            { value: 'description', label: 'Vehicle Details', icon: 'mdi:truck-info' },
            { value: 'subtrips', label: 'Subtrip List', icon: 'mdi:route' },
            { value: 'expenses', label: 'Expense Details', icon: 'mdi:currency-usd' },
          ].map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              icon={<Iconify icon={tab.icon} />}
              iconPosition="start"
            />
          ))}
        </Tabs>

        <Box sx={{ p: 3, minHeight: 400 }}>
          {tabValue === 'description' && (
            <Box>
              <Markdown children={description} />
            </Box>
          )}

          {tabValue === 'subtrips' && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {SUBTRIP_HEADS.map((head) => (
                      <StyledTableCell key={head}>{head}</StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subtrips.map((st) => (
                    <StyledTableRow key={st._id}>
                      <TableCell>{st._id}</TableCell>
                      <TableCell>{st.tripId?.driverId?.driverName}</TableCell>
                      <TableCell>{fDate(st.startDate)}</TableCell>
                      <TableCell>{st.subtripStatus}</TableCell>
                      <TableCell>{st.loadingPoint}</TableCell>
                      <TableCell>{st.unloadingPoint}</TableCell>
                    </StyledTableRow>
                  ))}
                  {subtrips.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={SUBTRIP_HEADS.length} align="center">
                        No subtrips found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 'expenses' && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {EXPENSE_HEADS.map((head) => (
                      <StyledTableCell key={head}>{head}</StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((exp) => (
                    <StyledTableRow key={exp._id}>
                      <TableCell>{fDate(exp.date)}</TableCell>
                      <TableCell>{exp.expenseType}</TableCell>
                      <TableCell>{exp.amount}</TableCell>
                      <TableCell>{exp.slipNo}</TableCell>
                    </StyledTableRow>
                  ))}
                  {expenses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={EXPENSE_HEADS.length} align="center">
                        No expenses found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Card>
    </DashboardContent>
  );
}
