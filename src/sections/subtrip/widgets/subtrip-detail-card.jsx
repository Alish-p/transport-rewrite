import { useNavigate } from 'react-router';

import { Box, Grid, Paper, Stack, Divider, Tooltip, Typography, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';

import { wrapText } from 'src/utils/change-case';
import { fCurrency } from 'src/utils/format-number';
import { calculateDriverSalaryPerSubtrip } from 'src/utils/utils';

import { Iconify } from 'src/components/iconify';

export const SubtripDetailCard = ({ selectedSubtrip }) => {
  const {
    loadingWeight,
    rate,
    commissionRate,
    startKm,
    invoiceNo,
    shipmentNo,
    consignee,
    orderNo,
    materialType,
    grade,
    diNumber,
  } = selectedSubtrip;

  // Calculate financial metrics
  const calculateFinancials = () => {
    if (!selectedSubtrip)
      return {
        freightAmount: 0,
        expenses: 0,
        driverSalary: 0,
      };

    // Calculate freightAmount (rate * loadingWeight)
    const freightAmount = (rate || 0) * (loadingWeight || 0);

    // Calculate total expenses
    const expenses =
      selectedSubtrip.expenses?.reduce((total, expense) => total + (expense.amount || 0), 0) || 0;

    // Calculate driver salary
    const driverSalary = calculateDriverSalaryPerSubtrip(selectedSubtrip);

    // Calculate invoice details

    return {
      freightAmount,
      expenses,
      driverSalary,
    };
  };

  const { freightAmount, expenses, driverSalary } = calculateFinancials();

  // Check if vehicle is owned
  const isOwn = selectedSubtrip?.tripId?.vehicleId?.isOwn || false;
  const vehicleType = selectedSubtrip?.tripId?.vehicleId?.vehicleType || '';

  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="mdi:truck-fast-outline" sx={{ color: 'primary.main' }} />
          Subtrip Data
        </Typography>
        <Tooltip title="Edit Details">
          <IconButton
            color="default"
            onClick={() => {
              navigate(paths.dashboard.subtrip.edit(selectedSubtrip._id));
            }}
          >
            <Iconify icon="mdi:pencil" />
          </IconButton>
        </Tooltip>
      </Stack>

      {selectedSubtrip ? (
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {isOwn && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Start Km
                </Typography>
                <Typography variant="body2" color="warning.main">
                  {startKm || '-'} km
                </Typography>
              </Box>
            )}

            <Box>
              <Typography variant="caption" color="text.secondary">
                Freight Rate
              </Typography>
              <Typography variant="body2" color="warning.main">
                {fCurrency(rate || 0)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Loading Weight
              </Typography>
              <Typography variant="body2" color="warning.main">
                {loadingWeight || 0} Ton
              </Typography>
            </Box>

            {!isOwn && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Effective Rate
                </Typography>
                <Typography variant="body2" color="warning.main">
                  {fCurrency(rate - commissionRate || 0)}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography variant="caption" color="text.secondary">
                Invoice No
              </Typography>

              <Typography variant="body2">{invoiceNo || '-'}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Shipment No
              </Typography>

              <Typography variant="body2">{shipmentNo || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Consignee
              </Typography>
              <Typography variant="body2">{consignee || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Order No
              </Typography>
              <Typography variant="body2">{orderNo || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Material Type
              </Typography>
              <Typography variant="body2">{materialType || '-'}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Grade
              </Typography>
              <Typography variant="body2">{grade || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                DI Number
              </Typography>

              <Typography variant="body2">{diNumber || '-'}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="caption" color="text.secondary">
              Trip Details
            </Typography>
            <Box sx={{ mt: 1, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Vehicle</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {selectedSubtrip.tripId?.vehicleId?.vehicleNo || '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Driver</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {selectedSubtrip.tripId?.driverId?.driverName || '-'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Customer</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {wrapText(selectedSubtrip?.customerId?.customerName || '-', 20)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Route</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {wrapText(selectedSubtrip?.routeCd?.routeName || '-', 20)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Financial Summary Section */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Financial Summary
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                {/* Income Card */}
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: 'success.lighter',
                      border: '1px solid',
                      borderColor: 'success.light',
                      borderRadius: 1,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Iconify icon="mdi:cash-plus" sx={{ color: 'success.main' }} />
                      <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                        Freight Amount
                      </Typography>
                    </Stack>
                    <Typography variant="h6" sx={{ color: 'success.dark' }}>
                      {fCurrency(freightAmount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Rate: ₹{rate || 0} × Weight: {loadingWeight || 0} Ton
                    </Typography>
                  </Paper>
                </Grid>
                {/* Expenses Card */}
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: 'error.lighter',
                      border: '1px solid',
                      borderColor: 'error.light',
                      borderRadius: 1,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Iconify icon="mdi:cash-minus" sx={{ color: 'error.main' }} />
                      <Typography variant="subtitle2" sx={{ color: 'error.dark' }}>
                        Expenses
                      </Typography>
                    </Stack>
                    <Typography variant="h6" sx={{ color: 'error.dark' }}>
                      {fCurrency(expenses)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedSubtrip.expenses?.length || 0} expense entries
                    </Typography>
                  </Paper>
                </Grid>

                {/* Driver Salary Card */}
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: 'primary.lighter',
                      border: '1px solid',
                      borderColor: 'primary.light',
                      borderRadius: 1,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Iconify icon="mdi:account-cash" sx={{ color: 'primary.main' }} />
                      <Typography variant="subtitle2" sx={{ color: 'primary.dark' }}>
                        Driver Salary
                      </Typography>
                    </Stack>
                    <Typography variant="h6" sx={{ color: 'primary.dark' }}>
                      {fCurrency(driverSalary || 0)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Driver: {selectedSubtrip.tripId?.driverId?.driverName || '-'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Stack>
      ) : (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
          Select a subtrip to view details
        </Typography>
      )}
    </Paper>
  );
};
