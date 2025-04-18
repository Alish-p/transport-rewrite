import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback } from 'react';

// MUI Components
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Grid,
  Card,
  Stack,
  Paper,
  Table,
  Alert,
  Button,
  Tooltip,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  InputAdornment,
  TableContainer,
  LinearProgress,
  CircularProgress,
} from '@mui/material';

// Custom Hooks and Components
import { useBoolean } from 'src/hooks/use-boolean';

// Utility functions
import { wrapText } from 'src/utils/change-case';
import { fNumber, fCurrency } from 'src/utils/format-number';
import { calculateDriverSalaryPerSubtrip } from 'src/utils/utils';

import { useSubtrip, useLoadedSubtrips, useUpdateSubtripReceiveInfo } from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
// Table Components

// Constants and Config
import { receiveSchema } from './subtrip-schemas';
import { TableNoData } from '../../components/table';
import { today, fDate } from '../../utils/format-time';
import { loadingWeightUnit } from '../vehicle/vehicle-config';
import { subtripExpenseTypes } from '../expense/expense-config';
import { KanbanSubtripDialog } from '../kanban/components/kanban-subtrip-dialog';

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

const ReceiveSection = ({
  selectedSubtrip,
  subtripDialog,
  currentSubtrip,
  errors,
  methods,
  isLoadingSubtripDetails,
}) => {
  const { vehicleType, isOwn, trackingLink } = selectedSubtrip?.tripId?.vehicleId || {};

  const { watch } = methods;
  const { loadingWeight, startKm } = watch();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        position: 'relative',
      }}
    >
      {isLoadingSubtripDetails && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 2 }}>
          <LinearProgress color="info" />
        </Box>
      )}

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Iconify icon="mdi:truck-outline" sx={{ color: 'primary.main' }} />
        <Typography variant="h6">LR Receive Information</Typography>
      </Stack>

      <Box sx={{ mb: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={subtripDialog.onTrue}
          disabled={!!currentSubtrip || isLoadingSubtripDetails}
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
        {errors.subtripId && (
          <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
            {errors.subtripId.message}
          </Typography>
        )}
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }}
        rowGap={3}
        columnGap={2}
      >
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
  const subtripExpenses = selectedSubtrip?.expenses || [];

  return (
    <Card sx={{ mt: 3, p: 2 }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1">Existing Expenses</Typography>
        <Typography variant="subtitle2" color="primary">
          {`Total Expenses: ${fCurrency(
            subtripExpenses.reduce((acc, expense) => acc + expense.amount, 0)
          )}`}
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Diesel Ltr</TableCell>
              <TableCell align="center">Diesel Price</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">Remarks</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {subtripExpenses.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell align="center">{fDate(expense.date)}</TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Iconify
                      icon={
                        subtripExpenseTypes.find((type) => type.value === expense.expenseType).icon
                      }
                      sx={{ mr: 1 }}
                    />
                    {expense.expenseType}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {expense.dieselLtr ? `${fNumber(expense.dieselLtr)} L` : '-'}
                </TableCell>
                <TableCell align="center">
                  {expense.dieselPrice ? `${fNumber(expense.dieselPrice)}` : '-'}
                </TableCell>
                <TableCell align="center">{fCurrency(expense.amount)}</TableCell>

                <TableCell align="center">{expense.remarks || '-'}</TableCell>
              </TableRow>
            ))}
            <TableNoData notFound={subtripExpenses.length === 0} />
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
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
          Subtrip Data
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

export function SubtripReceiveForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSubtripId = searchParams.get('currentSubtrip');
  const redirectTo = searchParams.get('redirectTo');

  // State management
  const [selectedSubtripId, setSelectedSubtripId] = useState(null);
  const [selectedSubtrip, setSelectedSubtrip] = useState(null);

  // Dialog states
  const editMode = useBoolean();
  const subtripDialog = useBoolean();

  // Data fetching
  const { data: loadedSubtrips = [], isLoading: loadingLoadedSubtrips } = useLoadedSubtrips();

  // Fetch FULL details of the selected subtrip ID
  const {
    data: detailedSubtrip,
    isLoading: isLoadingSubtripDetails,
    error: subtripDetailError,
  } = useSubtrip(selectedSubtripId);

  // Mutation hook
  const receiveSubtrip = useUpdateSubtripReceiveInfo();

  const defaultValues = useMemo(
    () => ({
      subtripId: '',
      endDate: today(),
      unloadingWeight: 0,
      endKm: 0,
      commissionRate: 0,
      hasShortage: false,
      hasError: false,
      shortageWeight: 0,
      shortageAmount: 0,
      remarks: '',
    }),
    []
  );

  // Form setup
  const methods = useForm({
    resolver: zodResolver(receiveSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    watch,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const { subtripId, hasError, hasShortage } = watch();

  // ----------------------------------------------------------------------
  // Event Handlers
  // ----------------------------------------------------------------------

  const handleReset = useCallback(() => {
    reset(defaultValues);
    setSelectedSubtripId(null);
    setSelectedSubtrip(null);
    editMode.onFalse();
  }, [reset, defaultValues, editMode]);

  const handleSubtripChange = useCallback(
    (subtrip) => {
      subtripDialog.onFalse();
      const newId = subtrip?._id;

      if (newId && newId !== selectedSubtripId) {
        console.log('New Subtrip ID Selected:', newId);
        setSelectedSubtripId(newId);
        setSelectedSubtrip(null);
        reset({ ...defaultValues, subtripId: newId }, { keepErrors: false, keepDirty: false });
        setTimeout(() => trigger('subtripId'), 0);
      } else if (!newId) {
        handleReset();
      }
    },
    [selectedSubtripId, reset, handleReset, subtripDialog, trigger, defaultValues]
  );

  const onSubmit = async (data) => {
    if (!selectedSubtrip) {
      console.error('Submit attempted before subtrip details were loaded.');
      return;
    }

    try {
      await receiveSubtrip({
        id: selectedSubtrip._id,
        data: {
          unloadingWeight: data.unloadingWeight,
          endKm: data.endKm,
          commissionRate: data.commissionRate,
          endDate: data.endDate,
          hasShortage: data.hasShortage,
          hasError: data.hasError,
          shortageWeight: data.shortageWeight,
          shortageAmount: data.shortageAmount,
          remarks: data.remarks,
          invoiceNo: data.invoiceNo,
          rate: data.rate,
          shipmentNo: data.shipmentNo,
          consignee: data.consignee,
          orderNo: data.orderNo,
          materialType: data.materialType,
          grade: data.grade,
          diNumber: data.diNumber,
          loadingWeight: data.loadingWeight,
        },
      });

      handleReset();

      if (redirectTo) {
        navigate(redirectTo);
      }
    } catch (error) {
      console.error('Failed to update subtrip:', error);
    }
  };

  // ----------------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------------

  // Effect to handle initial load from URL param
  useEffect(() => {
    if (
      currentSubtripId &&
      !selectedSubtripId &&
      !loadingLoadedSubtrips &&
      loadedSubtrips.length > 0
    ) {
      const subtripExists = loadedSubtrips.some((s) => s._id === currentSubtripId);
      if (subtripExists) {
        console.log('Setting Subtrip ID from URL Param:', currentSubtripId);
        setSelectedSubtripId(currentSubtripId);
      } else {
        console.warn(`Subtrip ID ${currentSubtripId} from URL not found.`);
      }
    }
  }, [currentSubtripId, loadedSubtrips, selectedSubtripId, loadingLoadedSubtrips]);

  // Effect to process fetched detailed subtrip data
  useEffect(() => {
    if (detailedSubtrip && detailedSubtrip._id === selectedSubtripId) {
      console.log('Detailed Subtrip Data Received:', detailedSubtrip);
      setSelectedSubtrip(detailedSubtrip);

      reset(
        {
          ...defaultValues,
          subtripId: detailedSubtrip._id,
          loadingWeight: detailedSubtrip.loadingWeight || 0,
          invoiceNo: detailedSubtrip.invoiceNo || '',
          shipmentNo: detailedSubtrip.shipmentNo || '',
          consignee: detailedSubtrip.consignee || '',
          materialType: detailedSubtrip.materialType || '',
          orderNo: detailedSubtrip.orderNo || '',
          grade: detailedSubtrip.grade || '',
          diNumber: detailedSubtrip.diNumber || '',
          rate: detailedSubtrip.rate || 0,
          unloadingWeight: detailedSubtrip.loadingWeight || 0,
          endKm: detailedSubtrip.startKm || 0,
          commissionRate: detailedSubtrip.commissionRate || 0,
          hasShortage: detailedSubtrip.hasShortage || false,
          hasError: detailedSubtrip.hasError || false,
          shortageWeight: detailedSubtrip.shortageWeight || 0,
          shortageAmount: detailedSubtrip.shortageAmount || 0,
          remarks: detailedSubtrip.remarks || '',
          endDate: detailedSubtrip.endDate ? new Date(detailedSubtrip.endDate) : today(),
        },
        { keepErrors: false, keepDirty: true }
      );

      setTimeout(() => trigger(['subtripId']), 100);
    } else if (subtripDetailError) {
      console.error('Error fetching subtrip details:', subtripDetailError);
      alert(`Error loading subtrip details: ${subtripDetailError.message || 'Unknown error'}`);
      handleReset();
    }
  }, [
    detailedSubtrip,
    selectedSubtripId,
    reset,
    defaultValues,
    trigger,
    handleReset,
    subtripDetailError,
  ]);

  // ----------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------

  return (
    <>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <ReceiveSection
              selectedSubtrip={selectedSubtrip}
              subtripDialog={subtripDialog}
              currentSubtrip={currentSubtripId}
              errors={errors}
              methods={methods}
              isLoadingSubtripDetails={isLoadingSubtripDetails}
            />

            {isLoadingSubtripDetails && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {subtripDetailError && !isLoadingSubtripDetails && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Failed to load subtrip details. Please try selecting again.
              </Alert>
            )}

            {selectedSubtrip && <IssueIndicatorsSection />}

            {hasShortage && <ShortageSection />}

            {hasError && <ErrorSection />}

            <Stack sx={{ my: 3 }} direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                color="inherit"
                variant="outlined"
                onClick={handleReset}
                disabled={isSubmitting || isLoadingSubtripDetails}
              >
                Reset
              </Button>

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!isValid || !selectedSubtrip || isLoadingSubtripDetails}
              >
                Save Changes
              </LoadingButton>
            </Stack>

            {selectedSubtrip && <ExpenseListSection selectedSubtrip={selectedSubtrip} />}
          </Grid>

          <Grid item xs={12} md={4}>
            {isLoadingSubtripDetails ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              selectedSubtrip && (
                <SubtripMetadataSection
                  selectedSubtrip={selectedSubtrip}
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
        selectedSubtrip={selectedSubtrip}
        onSubtripChange={handleSubtripChange}
        subtrips={loadedSubtrips}
        isLoading={loadingLoadedSubtrips}
        dialogTitle="Select Subtrip to Receive"
      />
    </>
  );
}
