/* eslint-disable react/prop-types */
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { useDrivers } from 'src/query/use-driver';
import { useVehicles } from 'src/query/use-vehicle';
import { useCustomers } from 'src/query/use-customer';
import { useTransporters } from 'src/query/use-transporter';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function SubtripTableFiltersResult({ filters, onFilters, onResetFilters }) {
  const { data: customers = [] } = useCustomers();
  const { data: vehicles = [] } = useVehicles();
  const { data: transporters = [] } = useTransporters();
  const { data: drivers = [] } = useDrivers();

  const handleRemoveCustomer = () => {
    onFilters('customerId', '');
  };

  const handleRemoveTransport = () => {
    onFilters('transportName', '');
  };

  const handleRemoveVehicleNo = () => {
    onFilters('vehicleNo', '');
  };

  const handleRemoveDriver = () => {
    onFilters('driverId', '');
  };

  const handleRemoveSubtripId = () => {
    onFilters('subtripId', '');
  };

  const handleRemoveStartDate = () => {
    onFilters('startFromDate', null);
    onFilters('startEndDate', null);
  };

  const handleRemoveEwayDate = () => {
    onFilters('ewayExpiryFromDate', null);
    onFilters('ewayExpiryEndDate', null);
  };

  const handleRemoveEndDate = () => {
    onFilters('subtripEndFromDate', null);
    onFilters('subtripEndEndDate', null);
  };

  const handleClearAll = () => {
    onResetFilters();
  };

  const getCustomerName = (id) => {
    const customer = customers.find((c) => c._id === id);
    return customer?.customerName || id;
  };

  const getTransporterName = (id) => {
    const transporter = transporters.find((t) => t._id === id);
    return transporter?.transportName || id;
  };

  const getVehicleNumber = (id) => {
    const vehicle = vehicles.find((v) => v._id === id);
    return vehicle?.vehicleNo || id;
  };

  const getDriverName = (id) => {
    const driver = drivers.find((d) => d._id === id);
    return driver?.driverName || id;
  };

  const startDateShortLabel = fDateRangeShortLabel(filters.startFromDate, filters.startEndDate);
  const ewayDateShortLabel = fDateRangeShortLabel(
    filters.ewayExpiryFromDate,
    filters.ewayExpiryEndDate
  );
  const endDateShortLabel = fDateRangeShortLabel(
    filters.subtripEndFromDate,
    filters.subtripEndEndDate
  );

  return (
    <Stack spacing={1.5} sx={{ p: 2, pt: 0 }}>
      <Box sx={{ width: '100%' }}>
        <Scrollbar>
          <Stack
            flexGrow={1}
            spacing={1}
            direction="row"
            alignItems="center"
            sx={{
              py: 1,
              px: 0.5,
              minWidth: 'min-content',
            }}
          >
            {filters.customerId && (
              <Block label="Customer">
                <Chip
                  size="small"
                  label={getCustomerName(filters.customerId)}
                  onDelete={handleRemoveCustomer}
                />
              </Block>
            )}

            {filters.transportName && (
              <Block label="Transporter">
                <Chip
                  size="small"
                  label={getTransporterName(filters.transportName)}
                  onDelete={handleRemoveTransport}
                />
              </Block>
            )}

            {filters.vehicleNo && (
              <Block label="Vehicle No:">
                <Chip
                  size="small"
                  label={getVehicleNumber(filters.vehicleNo)}
                  onDelete={handleRemoveVehicleNo}
                />
              </Block>
            )}

            {filters.driverId && (
              <Block label="Driver:">
                <Chip
                  size="small"
                  label={getDriverName(filters.driverId)}
                  onDelete={handleRemoveDriver}
                />
              </Block>
            )}

            {filters.subtripId && (
              <Block label="Subtrip Id:">
                <Chip size="small" label={filters.subtripId} onDelete={handleRemoveSubtripId} />
              </Block>
            )}

            {filters.startFromDate && filters.startEndDate && (
              <Block label="Start Date:">
                <Chip size="small" label={startDateShortLabel} onDelete={handleRemoveStartDate} />
              </Block>
            )}

            {filters.ewayExpiryFromDate && filters.ewayExpiryEndDate && (
              <Block label="E-way Expiry:">
                <Chip size="small" label={ewayDateShortLabel} onDelete={handleRemoveEwayDate} />
              </Block>
            )}

            {filters.subtripEndFromDate && filters.subtripEndEndDate && (
              <Block label="End Date:">
                <Chip size="small" label={endDateShortLabel} onDelete={handleRemoveEndDate} />
              </Block>
            )}

            {filters.status && filters.status.length > 0 && (
              <Block label="Status:">
                {filters.status.map((status) => (
                  <Chip
                    key={status}
                    size="small"
                    label={status}
                    onDelete={() => {
                      const newStatus = filters.status.filter((s) => s !== status);
                      onFilters('status', newStatus);
                    }}
                  />
                ))}
              </Block>
            )}

            <Button
              color="error"
              onClick={handleClearAll}
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            >
              Clear
            </Button>
          </Stack>
        </Scrollbar>
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
