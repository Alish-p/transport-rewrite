import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import StepContent from '@mui/material/StepContent';

import { Field } from 'src/components/hook-form';
import { APP_ICONS } from 'src/components/iconify/icons';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { getJobStepError } from './subtrip-job-create-details-step';

export function SubtripJobCreateRouteStep({
  isLoadedJob,
  selectedCustomer,
  getLabel,
  consignees,
  canGoNextStep,
  isSubmitting,
  canSubmit,
  onPrevStep,
  onNextStep,
  billingParty,
  onSelectConsigneeClick,
  selectedConsignee,
}) {
  const isConsigneeBilling = billingParty === 'consignee';

  return (
    <StepContent>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
        {isLoadedJob && !isConsigneeBilling && (
          <Field.Configurable entity="subtrip" name="consignee" customerId={selectedCustomer?._id}>
            <Field.AutocompleteFreeSolo
              name="consignee"
              label={getLabel('consignee', 'Consignee')}
              options={(consignees || []).map(({ name }) => ({ label: name, value: name }))}
              disabled={!selectedCustomer}
            />
          </Field.Configurable>
        )}

        {isLoadedJob && isConsigneeBilling && (
          <DialogSelectButton
            onClick={onSelectConsigneeClick}
            placeholder="Select Consignee *"
            selected={selectedConsignee?.customerName}
            iconName={APP_ICONS.customer}
          />
        )}

        <Field.Configurable entity="subtrip" name="loadingPoint" customerId={selectedCustomer?._id}>
          <Field.Text name="loadingPoint" label={getLabel('loadingPoint', 'Loading Point')} />
        </Field.Configurable>
        <Field.Configurable
          entity="subtrip"
          name="unloadingPoint"
          customerId={selectedCustomer?._id}
        >
          <Field.MultiAutocompleteFreeSolo
            name="unloadingPoint"
            label={getLabel('unloadingPoint', 'Unloading Point')}
            placeholder="Add unloading points..."
            options={Array.from(
              new Set((consignees || []).map(({ address }) => address).filter(Boolean))
            ).map((addr) => ({ label: addr, value: addr }))}
            helperText={isLoadedJob ? "Consignee's Address" : undefined}
          />
        </Field.Configurable>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button onClick={onPrevStep}>Back</Button>
        {isLoadedJob ? (
          <Button variant="contained" onClick={onNextStep} disabled={!canGoNextStep}>
            Continue
          </Button>
        ) : (
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!canSubmit}
          >
            Create Job
          </LoadingButton>
        )}
      </Stack>
    </StepContent>
  );
}

export function getRouteStepError(
  form,
  {
    selectedVehicle,
    fetchingActiveTrip,
    activeTrip,
    selectedDriver,
    selectedCustomer,
    fields,
    billingParty,
    selectedConsignee,
  }
) {
  const jobStageError = getJobStepError(form, {
    selectedVehicle,
    fetchingActiveTrip,
    activeTrip,
    selectedDriver,
    selectedCustomer,
  });
  if (jobStageError) return jobStageError;

  const isOwnVehicle = !!selectedVehicle?.isOwn;
  const isLoaded = form.loadType === 'loaded' || !isOwnVehicle;

  const hasLoading = Boolean((form.loadingPoint || '').trim());
  const hasUnloading = Array.isArray(form.unloadingPoint)
    ? form.unloadingPoint.length > 0
    : Boolean((form.unloadingPoint || '').trim());

  const isFieldRequired = (name) => {
    const visibility = fields?.[name]?.visibility;
    if (visibility === 'required') return true;
    if (visibility === 'optional' || visibility === 'hidden') return false;
    if (name === 'loadingPoint' || name === 'unloadingPoint' || name === 'consignee') {
      return true;
    }
    return false;
  };

  if (isLoaded) {
    if (!selectedCustomer) return 'Please select a consignor';

    if (billingParty === 'consignee') {
      if (!selectedConsignee?._id) return 'Please select a consignee';
    } else if (isFieldRequired('consignee')) {
      const hasConsignee = !!(form.consignee && (form.consignee.value || form.consignee.label));
      if (!hasConsignee) return 'Please select a consignee';
    }
  }

  if (isFieldRequired('loadingPoint') && !hasLoading) {
    return 'Enter loading point';
  }
  if (isFieldRequired('unloadingPoint') && !hasUnloading) {
    return 'Enter unloading point';
  }

  return null;
}
