import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import StepContent from '@mui/material/StepContent';
import InputAdornment from '@mui/material/InputAdornment';

import { Field } from 'src/components/hook-form';
import { APP_ICONS } from 'src/components/iconify/icons';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { DRIVER_ADVANCE_GIVEN_BY_OPTIONS } from 'src/sections/subtrip/constants';

import { getMaterialStepError } from './subtrip-job-create-material-step';

export function SubtripJobCreateAdvanceStep({
  isLoadedJob,
  isOwnVehicle,
  selectedCustomer,
  billingParty,
  managesPumps,
  initialAdvanceDieselUnit,
  onSelectPumpClick,
  requiresPumpSelection,
  selectedPump,
  errors,
  isSubmitting,
  canSubmit,
  onPrevStep,
}) {
  const { watch } = useFormContext();
  const driverAdvanceGivenBy = watch('driverAdvanceGivenBy');

  const givenByOptions = useMemo(() => {
    const options = [DRIVER_ADVANCE_GIVEN_BY_OPTIONS.SELF];
    if (managesPumps) {
      options.push(DRIVER_ADVANCE_GIVEN_BY_OPTIONS.FUEL_PUMP);
    }
    if (isOwnVehicle) {
      if (selectedCustomer?.customerType === 'transporter') {
        options.push(DRIVER_ADVANCE_GIVEN_BY_OPTIONS.TRANSPORTER);
      } else if (billingParty === 'consignee') {
        options.push(DRIVER_ADVANCE_GIVEN_BY_OPTIONS.CONSIGNEE);
      } else {
        options.push(DRIVER_ADVANCE_GIVEN_BY_OPTIONS.CONSIGNOR);
      }
    }
    return options;
  }, [managesPumps, isOwnVehicle, selectedCustomer?.customerType, billingParty]);

  if (!isLoadedJob) {
    return null;
  }

  const isCustomerAdvance = [
    DRIVER_ADVANCE_GIVEN_BY_OPTIONS.TRANSPORTER,
    DRIVER_ADVANCE_GIVEN_BY_OPTIONS.CONSIGNOR,
    DRIVER_ADVANCE_GIVEN_BY_OPTIONS.CONSIGNEE,
  ].includes(driverAdvanceGivenBy);
  const isPumpAdvance = driverAdvanceGivenBy === DRIVER_ADVANCE_GIVEN_BY_OPTIONS.FUEL_PUMP;
  const isSelfAdvance = driverAdvanceGivenBy === DRIVER_ADVANCE_GIVEN_BY_OPTIONS.SELF;

  return (
    <StepContent>
      <Stack spacing={2.5}>
        <Box
          sx={{
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1.5,
            bgcolor: 'background.default',
          }}
        >
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '2fr 1fr' }} gap={1.5}>
            <Field.Text
              name="driverAdvance"
              label="Driver Advance (Amount)"
              type="number"
              placeholder="0"
              InputProps={{
                endAdornment: <InputAdornment position="end">₹</InputAdornment>,
              }}
            />
            <Field.Select name="driverAdvanceGivenBy" label="Given By">
              {givenByOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>

          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            {isCustomerAdvance && (
              <Chip
                label={`Advance from ${driverAdvanceGivenBy} (Will be deducted on Customer Invoice)`}
                color="info"
                size="small"
                variant="soft"
              />
            )}
            {isSelfAdvance && (
              <Chip
                label="Trip Expense (Recorded in company trip expenses)"
                color="default"
                size="small"
                variant="soft"
              />
            )}
            {isPumpAdvance && (
              <Chip
                label="Trip Expense (Via Fuel Pump)"
                color="warning"
                size="small"
                variant="soft"
              />
            )}
          </Box>
        </Box>

        {managesPumps && (
          <Box
            sx={{
              p: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1.5,
              bgcolor: 'background.default',
            }}
          >
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '2fr 1fr' }} gap={1.5}>
              <Field.InputWithUnit
                name="initialAdvanceDiesel"
                unitName="initialAdvanceDieselUnit"
                label="Diesel Intent"
                placeholder="0"
                textFieldProps={{}}
                unitOptions={[
                  { label: 'Litre', value: 'litre' },
                  { label: 'Amount', value: 'amount' },
                ]}
                defaultUnit="litre"
              />
              <Box>
                <DialogSelectButton
                  onClick={onSelectPumpClick}
                  placeholder={`Select Pump${requiresPumpSelection ? ' *' : ''}`}
                  selected={selectedPump?.name}
                  iconName={APP_ICONS.pump}
                  error={Boolean(errors.pumpCd)}
                />
                {errors.pumpCd && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.75, display: 'block' }}>
                    {errors.pumpCd.message}
                  </Typography>
                )}
              </Box>
            </Box>
            <Stack spacing={0.75} sx={{ mt: 1 }}>
              {initialAdvanceDieselUnit === 'litre' && (
                <Alert variant="outlined" severity="info">
                  In case of Litre Diesel Intent, expense will not be added automatically. Actuals
                  need to be added.
                </Alert>
              )}
            </Stack>
          </Box>
        )}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        <Button onClick={onPrevStep}>Back</Button>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={!canSubmit}
        >
          Create Job
        </LoadingButton>
      </Stack>
    </StepContent>
  );
}

const toNumber = (val) => {
  if (val === null || val === undefined || val === '') return undefined;
  const n = Number(val);
  return Number.isFinite(n) ? n : undefined;
};

export function getAdvanceStepError(form, context) {
  const materialStageError = getMaterialStepError(form, context);
  if (materialStageError) return materialStageError;

  const { selectedVehicle } = context || {};

  const isOwnVehicle = !!selectedVehicle?.isOwn;
  const isLoaded = form.loadType === 'loaded' || !isOwnVehicle;
  if (!isLoaded) return null;

  const dieselAdvance = toNumber(form.initialAdvanceDiesel);
  const pumpRequired =
    form.driverAdvanceGivenBy === DRIVER_ADVANCE_GIVEN_BY_OPTIONS.FUEL_PUMP ||
    (dieselAdvance !== undefined && dieselAdvance > 0);

  if (pumpRequired && !form.pumpCd) {
    return 'Please select a pump for driver advance or diesel intent';
  }

  return null;
}
