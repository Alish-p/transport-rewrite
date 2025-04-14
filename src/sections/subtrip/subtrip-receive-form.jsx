// ----------------------------------------------------------------------
// IMPORTS
// ----------------------------------------------------------------------

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
// React and Form Libraries
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

// MUI Components
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Stack,
  Paper,
  Button,
  Tooltip,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';

// Custom Hooks and Components
import { useBoolean } from 'src/hooks/use-boolean';

import { useUpdateSubtripReceiveInfo } from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// Constants and Config
import { SUBTRIP_STATUS } from './constants';
import { useSearchParams } from '../../routes/hooks';
import { loadingWeightUnit } from '../vehicle/vehicle-config';
import { KanbanSubtripDialog } from '../kanban/components/kanban-subtrip-dialog';

// ----------------------------------------------------------------------
// VALIDATION SCHEMA
// ----------------------------------------------------------------------

const validationSchema = zod
  .object({
    unloadingWeight: zod.number({ required_error: 'Unloading weight is required' }),
    endKm: zod.number({ required_error: 'End Km is required' }).optional(),
    commissionRate: zod
      .number()
      .min(0, { message: 'Commission rate cannot be negative' })
      .optional(),
    hasError: zod.boolean(),
    errorRemarks: zod.string().optional(),
    shortageWeight: zod.number().optional(),
    shortageAmount: zod.number().optional(),
    hasShortage: zod.boolean(),
    invoiceNo: zod.string().optional(),
    rate: zod.number().optional(),
  })
  .superRefine((values, ctx) => {
    // Validate unloadingWeight <= loadingWeight if loadingWeight is available
    if (values.loadingWeight && values.unloadingWeight > values.loadingWeight) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'Unloading weight must be less than or equal to loading weight',
        path: ['unloadingWeight'],
      });
    }

    // Validate endKm >= startKm if both are available
    if (values.startKm && values.endKm && values.endKm < values.startKm) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'End Km must be greater than or equal to Start Km',
        path: ['endKm'],
      });
    }
  });

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

// Basic Information Section
const BasicInfoSection = ({
  selectedSubtrip,
  subtripDialog,
  currentSubtrip,
  errors,
  vehicleType,
  isOwn,
  trackingLink,
}) => (
  <Paper
    elevation={0}
    sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
  >
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
      <Iconify icon="mdi:truck-outline" sx={{ color: 'primary.main' }} />
      <Typography variant="h6">Basic Information</Typography>
    </Stack>

    <Box
      display="grid"
      gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }}
      rowGap={3}
      columnGap={2}
    >
      {/* Subtrip Selection Button */}
      <Box>
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
                  {selectedSubtrip?.loadingWeight && (
                    <>
                      ≤ {selectedSubtrip.loadingWeight} {loadingWeightUnit[vehicleType]}
                    </>
                  )}
                </InputAdornment>
              ),
            }}
          />

          <Field.Text name="invoiceNo" label="Invoice No" type="text" required />

          <Field.Text
            name="rate"
            label="Freight Rate"
            type="number"
            required
            InputProps={{
              endAdornment: <InputAdornment position="end">₹</InputAdornment>,
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
                  endAdornment: (
                    <InputAdornment position="end"> ≥ {selectedSubtrip?.startKm} Km</InputAdornment>
                  ),
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
            <>
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

              <Field.Text
                name="effectiveRate"
                label="Effective Rate"
                type="number"
                placeholder="0"
                required
                disabled
                InputProps={{
                  endAdornment: <InputAdornment position="end">₹</InputAdornment>,
                }}
              />
            </>
          )}
        </>
      )}
    </Box>
  </Paper>
);

// Toggle Switches Section
const ToggleSwitchesSection = () => (
  <Paper
    elevation={0}
    sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
  >
    <Stack direction="row" spacing={3}>
      <Field.Switch
        name="hasShortage"
        label="Has Shortage"
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

// Shortage Information Section
const ShortageInfoSection = () => (
  <Paper
    elevation={0}
    sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
  >
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
      <Iconify icon="mdi:alert-circle-outline" sx={{ color: 'warning.main' }} />
      <Typography variant="h6">Shortage Information</Typography>
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

// Error Information Section
const ErrorInfoSection = () => (
  <Paper
    elevation={0}
    sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
  >
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
      <Iconify icon="mdi:alert-octagon-outline" sx={{ color: 'error.main' }} />
      <Typography variant="h6">Error Information</Typography>
    </Stack>

    <Box display="grid" rowGap={3}>
      <Field.Text name="errorRemarks" label="Error Remarks" type="text" multiline rows={3} />
    </Box>
  </Paper>
);

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export function SubtripReceiveForm({ currentSubtrip }) {
  // State and Hooks
  const [selectedSubtrip, setSelectedSubtrip] = useState(currentSubtrip || null);
  const subtripDialog = useBoolean(false);
  const receiveSubtrip = useUpdateSubtripReceiveInfo();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const navigate = useNavigate();

  // Default form values
  const defaultValues = useMemo(
    () => ({
      unloadingWeight: selectedSubtrip?.loadingWeight || 0,
      endKm: selectedSubtrip?.startKm || 0,
      commissionRate: 0,
      hasError: false,
      errorRemarks: '',
      shortageWeight: 0,
      shortageAmount: 0,
      hasShortage: false,
      loadingWeight: selectedSubtrip?.loadingWeight || 0,
      startKm: selectedSubtrip?.startKm || 0,
      invoiceNo: selectedSubtrip?.invoiceNo || '',
      rate: selectedSubtrip?.rate || 0,
      effectiveRate: selectedSubtrip?.rate || 0 - (selectedSubtrip?.commissionRate || 0),
    }),
    [selectedSubtrip]
  );

  // Form setup
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
  } = methods;

  const { hasError, hasShortage, commissionRate, rate } = watch();

  // Update form values when selectedSubtrip changes
  useEffect(() => {
    if (selectedSubtrip) {
      reset({
        ...defaultValues,
        unloadingWeight: selectedSubtrip.loadingWeight || 0,
        endKm: selectedSubtrip.startKm || 0,
        loadingWeight: selectedSubtrip.loadingWeight || 0,
        startKm: selectedSubtrip.startKm || 0,
        invoiceNo: selectedSubtrip.invoiceNo || '',
        rate: selectedSubtrip.rate || 0,
      });
    }
  }, [selectedSubtrip, reset, defaultValues]);

  // Update effective rate when commission rate changes
  useEffect(() => {
    if (commissionRate) {
      setValue('effectiveRate', rate - commissionRate);
    }
  }, [commissionRate, rate, setValue]);

  // Event handlers
  const handleSubtripChange = (subtrip) => {
    setSelectedSubtrip(subtrip);
  };

  const handleReset = () => {
    reset({
      endKm: 0,
      startKm: 0,
      loadingWeight: 0,
      unloadingWeight: 0,
      commissionRate: 0,
      hasShortage: false,
      hasError: false,
      invoiceNo: '',
      rate: 0,
      effectiveRate: 0,
    });
    setSelectedSubtrip(null);
  };

  const onSubmit = async (data) => {
    try {
      if (!selectedSubtrip) {
        console.error('No subtrip selected');
        return;
      }

      await receiveSubtrip({ id: selectedSubtrip._id, data });
      handleReset();

      if (redirectTo) {
        navigate(redirectTo);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Get vehicle details from selected subtrip
  const vehicleType = selectedSubtrip?.tripId?.vehicleId?.vehicleType || '';
  const isOwn = selectedSubtrip?.tripId?.vehicleId?.isOwn || false;
  const trackingLink = selectedSubtrip?.tripId?.vehicleId?.trackingLink || '';

  return (
    <>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <BasicInfoSection
          selectedSubtrip={selectedSubtrip}
          subtripDialog={subtripDialog}
          currentSubtrip={currentSubtrip}
          errors={errors}
          vehicleType={vehicleType}
          isOwn={isOwn}
          trackingLink={trackingLink}
        />

        {selectedSubtrip && <ToggleSwitchesSection />}

        {hasShortage && <ShortageInfoSection />}

        {hasError && <ErrorInfoSection />}

        <Stack sx={{ mt: 3 }} direction="row" justifyContent="flex-end" spacing={2}>
          <Button color="inherit" variant="outlined" onClick={handleReset}>
            Reset
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid || !selectedSubtrip}
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </Form>

      <KanbanSubtripDialog
        open={subtripDialog.value}
        onClose={subtripDialog.onFalse}
        selectedSubtrip={selectedSubtrip}
        onSubtripChange={handleSubtripChange}
        filterParams={{
          subtripStatus: [SUBTRIP_STATUS.LOADED],
        }}
      />
    </>
  );
}
