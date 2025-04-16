import { useForm } from 'react-hook-form';
// React and Form Libraries
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

// MUI Components
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Grid,
  Stack,
  Paper,
  Table,
  Button,
  Tooltip,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  Typography,
  InputAdornment,
  TableContainer,
  CircularProgress,
} from '@mui/material';

// Custom Hooks and Components
import { useBoolean } from 'src/hooks/use-boolean';

// Utility functions
import { wrapText } from 'src/utils/change-case';
import { fCurrency } from 'src/utils/format-number';
import { calculateDriverSalaryPerSubtrip } from 'src/utils/utils';

import { useSubtrip, useLoadedSubtrips, useUpdateSubtripReceiveInfo } from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
// Table Components
import { TableHeadCustom } from 'src/components/table';

// Constants and Config
import { receiveSchema } from './subtrip-schemas';
import { today, fDate } from '../../utils/format-time';
import { loadingWeightUnit } from '../vehicle/vehicle-config';
import { KanbanSubtripDialog } from '../kanban/components/kanban-subtrip-dialog';

// ----------------------------------------------------------------------
// VALIDATION SCHEMA
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

const ReceiveSection = ({ selectedSubtrip, subtripDialog, currentSubtrip, errors, methods }) => {
  const { vehicleType, isOwn, trackingLink } = selectedSubtrip?.tripId?.vehicleId || {};

  const { watch } = methods;
  const { loadingWeight, startKm } = watch();

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Iconify icon="mdi:truck-outline" sx={{ color: 'primary.main' }} />
        <Typography variant="h6">LR Receive Information</Typography>
      </Stack>

      <Box sx={{ mb: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={subtripDialog.onTrue}
          disabled={!!currentSubtrip}
          sx={{
            height: 56,
            justifyContent: 'flex-start',
            typography: 'body2',
            borderColor: errors.subtripId?.message ? 'error.main' : 'text.disabled',
          }}
          startIcon={
            <Iconify
              icon={selectedSubtrip ? 'mdi:truck-fast' : 'mdi:truck-fast-outline'}
              sx={{ color: selectedSubtrip ? 'primary.main' : 'text.disabled' }}
            />
          }
        >
          {selectedSubtrip
            ? `Subtrip #${selectedSubtrip._id || selectedSubtrip}`
            : 'Select Subtrip *'}
        </Button>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }}
        rowGap={3}
        columnGap={2}
      >
        {/* Subtrip Selection Button */}

        {selectedSubtrip && (
          <>
            <Field.Text
              name="unloadingWeight"
              label="Unloading Weight"
              type="number"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {loadingWeight && (
                      <>
                        ≤ {loadingWeight} {loadingWeightUnit[vehicleType]}
                      </>
                    )}
                  </InputAdornment>
                ),
              }}
            />

            {isOwn && (
              <Box sx={{ position: 'relative' }}>
                <Field.Text
                  name="endKm"
                  label="End Km"
                  type="number"
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end"> ≥ {startKm} Km</InputAdornment>,
                  }}
                />
                {trackingLink && (
                  <Tooltip title="Track Vehicle">
                    <IconButton
                      size="small"
                      onClick={() => {
                        window.open(trackingLink, '_blank');
                      }}
                      sx={{
                        position: 'absolute',
                        right: 60,
                        top: 10,
                        color: 'primary.main',
                      }}
                    >
                      <Iconify icon="mdi:map-marker" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}

            {!isOwn && (
              <Field.Text
                name="commissionRate"
                label="Transporter Commission Rate"
                type="number"
                placeholder="0"
                required
                InputProps={{
                  endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                }}
              />
            )}

            <Field.DatePicker name="endDate" label="LR Receive Date *" />
          </>
        )}
      </Box>
    </Paper>
  );
};

const IssueIndicatorsSection = () => (
  <Paper
    elevation={0}
    sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
  >
    <Stack direction="row" spacing={3}>
      <Field.Switch
        name="hasShortage"
        label="Has Shortage"
        color="warning"
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: 'warning.main',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: 'warning.main',
          },
        }}
      />
      <Field.Switch
        name="hasError"
        label="Has Error"
        color="error"
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: 'error.main',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: 'error.main',
          },
        }}
      />
    </Stack>
  </Paper>
);

const ShortageSection = () => (
  <Paper
    elevation={0}
    sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
  >
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
      <Iconify icon="mdi:alert-circle-outline" sx={{ color: 'warning.main' }} />
      <Typography variant="h6">Shortage Details</Typography>
    </Stack>

    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} rowGap={3} columnGap={2}>
      <Field.Text
        name="shortageWeight"
        label="Shortage Weight"
        type="number"
        InputProps={{
          endAdornment: <InputAdornment position="end">Ton</InputAdornment>,
        }}
      />

      <Field.Text
        name="shortageAmount"
        label="Shortage Amount"
        type="number"
        InputProps={{
          endAdornment: <InputAdornment position="end">₹</InputAdornment>,
        }}
      />
    </Box>
  </Paper>
);

const ErrorSection = () => (
  <Paper
    elevation={0}
    sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
  >
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
      <Iconify icon="mdi:alert-octagon-outline" sx={{ color: 'error.main' }} />
      <Typography variant="h6">Error Details</Typography>
    </Stack>

    <Box display="grid" rowGap={3}>
      <Field.Text name="remarks" label="Error Remarks" type="text" multiline rows={3} />
    </Box>
  </Paper>
);

const ExpenseListSection = ({ selectedSubtrip }) => {
  const TABLE_HEAD = [
    { id: 'expenseType', label: 'Type', align: 'left' },
    { id: 'amount', label: 'Amount', align: 'right' },
    { id: 'date', label: 'Date', align: 'center' },
  ];

  if (!selectedSubtrip?.expenses?.length) {
    return null;
  }

  const { expenses } = selectedSubtrip;

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, my: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Iconify icon="mdi:cash-multiple" sx={{ color: 'info.main' }} />
        <Typography variant="h6">Expense List</Typography>
      </Stack>

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Table size="medium" sx={{ minWidth: 800 }}>
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            {expenses.map((expense, index) => (
              <TableRow hover key={expense._id || index}>
                <TableCell>{expense.expenseType || '-'}</TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="error.main">
                    {fCurrency(expense.amount || 0)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" color="text.secondary">
                    {fDate(expense.date)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const SubtripMetadataSection = ({ selectedSubtrip, isEditMode, handleEditToggle, methods }) => {
  const { watch } = methods;
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
  } = watch();

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

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="mdi:truck-fast-outline" sx={{ color: 'primary.main' }} />
          Subtrip Metadata
        </Typography>
        <Tooltip title={isEditMode ? 'Save Changes' : 'Edit Details'}>
          <IconButton onClick={handleEditToggle} color={isEditMode ? 'primary' : 'default'}>
            <Iconify icon={isEditMode ? 'mdi:content-save' : 'mdi:pencil'} />
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
              {isEditMode ? (
                <Field.Text
                  name="rate"
                  size="small"
                  sx={{ mt: 0.5 }}
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">₹</InputAdornment> }}
                />
              ) : (
                <Typography variant="body2" color="warning.main">
                  {fCurrency(rate || 0)}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Loading Weight
              </Typography>
              {isEditMode ? (
                <Field.Text
                  name="loadingWeight"
                  size="small"
                  sx={{ mt: 0.5 }}
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">Ton</InputAdornment> }}
                />
              ) : (
                <Typography variant="body2" color="warning.main">
                  {loadingWeight || 0} {loadingWeightUnit[vehicleType]}
                </Typography>
              )}
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
              {isEditMode ? (
                <Field.Text name="invoiceNo" size="small" sx={{ mt: 0.5 }} />
              ) : (
                <Typography variant="body2">{invoiceNo || '-'}</Typography>
              )}
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Shipment No
              </Typography>
              {isEditMode ? (
                <Field.Text name="shipmentNo" size="small" sx={{ mt: 0.5 }} />
              ) : (
                <Typography variant="body2">{shipmentNo || '-'}</Typography>
              )}
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
              {isEditMode ? (
                <Field.Text name="diNumber" size="small" sx={{ mt: 0.5 }} />
              ) : (
                <Typography variant="body2">{diNumber || '-'}</Typography>
              )}
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

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export function SubtripReceiveForm({ currentSubtrip }) {
  // State and Hooks
  const receiveSubtrip = useUpdateSubtripReceiveInfo();
  const { data: loadedSubtrips, isLoading: isLoadedSubtripsLoading } = useLoadedSubtrips();

  const editMode = useBoolean();
  const subtripDialog = useBoolean();

  const defaultValues = useMemo(
    () => ({
      subtripId: currentSubtrip || '',
      endDate: today(),
    }),
    [currentSubtrip]
  );

  // Form setup
  const methods = useForm({
    resolver: zodResolver(receiveSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const { subtripId, hasError, hasShortage } = watch();

  const { data: selectedSubtripData, isLoading: isSubtripLoading } = useSubtrip(subtripId);

  // Update form values when selectedSubtrip changes
  useEffect(() => {
    if (selectedSubtripData) {
      reset({
        ...defaultValues,
        ...selectedSubtripData,
        subtripId: selectedSubtripData._id,
        unloadingWeight: selectedSubtripData.loadingWeight || 0,
      });
    }
  }, [selectedSubtripData, reset, defaultValues]);

  // Event handlers
  const handleSubtripChange = (subtrip) => {
    setValue('subtripId', subtrip._id);
    editMode.onFalse();
  };

  const handleReset = () => {
    reset({
      subtripId: '',
    });
    editMode.onFalse();
  };

  const onSubmit = async (data) => {
    try {
      await receiveSubtrip({ id: subtripId, data });
      handleReset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <ReceiveSection
              selectedSubtrip={selectedSubtripData}
              subtripDialog={subtripDialog}
              currentSubtrip={currentSubtrip}
              errors={errors}
              methods={methods}
            />

            {isSubtripLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {selectedSubtripData && <IssueIndicatorsSection />}

            {hasShortage && <ShortageSection />}

            {hasError && <ErrorSection />}

            <Stack sx={{ my: 3 }} direction="row" justifyContent="flex-end" spacing={2}>
              <Button color="inherit" variant="outlined" onClick={handleReset}>
                Reset
              </Button>

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!isValid || !selectedSubtripData || isSubtripLoading}
              >
                Save Changes
              </LoadingButton>
            </Stack>

            {selectedSubtripData && <ExpenseListSection selectedSubtrip={selectedSubtripData} />}
          </Grid>

          <Grid item xs={12} md={4}>
            {isSubtripLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              selectedSubtripData && (
                <SubtripMetadataSection
                  selectedSubtrip={selectedSubtripData}
                  isEditMode={editMode.value}
                  handleEditToggle={editMode.onToggle}
                  methods={methods}
                />
              )
            )}
          </Grid>
        </Grid>
      </Form>

      <KanbanSubtripDialog
        open={subtripDialog.value}
        onClose={subtripDialog.onFalse}
        selectedSubtrip={selectedSubtripData}
        onSubtripChange={handleSubtripChange}
        subtrips={loadedSubtrips}
        isLoading={isLoadedSubtripsLoading}
      />
    </>
  );
}
