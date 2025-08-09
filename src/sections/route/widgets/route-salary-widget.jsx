import { useCallback } from 'react';

import Card from '@mui/material/Card';
import { Tooltip } from '@mui/material';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { copyToClipboard } from 'src/utils/copy-to-clipboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { Label } from '../../../components/label';
import { getVehicleTypeTyreColor } from '../constants';

export function RouteSalaryWidget({ route }) {
  const { _id, vehicleConfiguration = [] } = route || {};

  const handleCopy = useCallback(() => {
    const text = JSON.stringify({ vehicleConfiguration }, null, 2);
    copyToClipboard(text);
    toast.success('Copied to clipboard');
  }, [vehicleConfiguration]);

  return (
    <Card sx={{ height: 1 }}>
      <CardHeader
        title="Salary Configuration"
        avatar={<Iconify icon="solar:wallet-bold" color="primary.main" width={24} />}
        action={
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Copy">
              <IconButton onClick={handleCopy}>
                <Iconify icon="solar:copy-bold" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton component={RouterLink} href={paths.dashboard.route.edit(_id)}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
          </Stack>
        }
        sx={{
          '& .MuiCardHeader-avatar': { mr: 1 },
          '& .MuiCardHeader-title': { fontWeight: 'fontWeightBold' },
        }}
      />
      <TableContainer sx={{ p: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Vehicle Type</TableCell>
              <TableCell>Tyres</TableCell>
              <TableCell>Fixed Salary</TableCell>
              <TableCell>Percentage Salary</TableCell>
              <TableCell>Fixed Mileage</TableCell>
              <TableCell>Performance Mileage</TableCell>
              <TableCell>Diesel</TableCell>
              <TableCell>AdBlue</TableCell>
              <TableCell>Advance Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicleConfiguration.length ? (
              vehicleConfiguration.map((item, index) => {
                const color = getVehicleTypeTyreColor(item.vehicleType, item.noOfTyres);
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Label variant="soft" color={color}>
                        {item.vehicleType}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Label variant="soft" color={color}>
                        {item.noOfTyres}
                      </Label>
                    </TableCell>
                    <TableCell>{item.fixedSalary}</TableCell>
                    <TableCell>{item.percentageSalary}</TableCell>
                    <TableCell>{item.fixMilage}</TableCell>
                    <TableCell>{item.performanceMilage}</TableCell>
                    <TableCell>{item.diesel}</TableCell>
                    <TableCell>{item.adBlue}</TableCell>
                    <TableCell>{item.advanceAmt}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No salary configuration
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default RouteSalaryWidget;
