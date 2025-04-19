// Cleaned & Simplified SubtripReceiveForm
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Box, Grid, Card, Stack, Button, Typography, CircularProgress } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { today } from 'src/utils/format-time';

import { useSubtrip, useLoadedSubtrips, useUpdateSubtripReceiveInfo } from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { receiveSchema } from './subtrip-schemas';
import { BasicExpenseTable } from './widgets/basic-expense-table';
import { SubtripDetailCard } from './widgets/subtrip-detail-card';
import { KanbanSubtripDialog } from '../kanban/components/kanban-subtrip-dialog';

const defaultValues = {
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
};

const ReceiveFormFields = ({ selectedSubtrip, methods, errors, subtripDialog, isLoading }) => {
  const { watch } = methods;
  const { hasError, hasShortage } = watch();
  const { isOwn } = selectedSubtrip?.tripId?.vehicleId || {};

  return (
    <Card sx={{ p: 3 }}>
      {isLoading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
          <CircularProgress color="info" size={24} sx={{ mt: 1 }} />
        </Box>
      )}

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Iconify icon="mdi:truck-outline" sx={{ color: 'primary.main' }} />
        <Typography variant="h6">Subtrip Receive Details</Typography>
      </Stack>

      <DialogSelectButton
        onClick={subtripDialog.onTrue}
        placeholder="Select Subtrip *"
        selected={selectedSubtrip?._id}
        error={!!errors.subtripId?.message}
        iconName="mdi:truck-fast"
        sx={{ mb: 3 }}
      />

      {selectedSubtrip && (
        <>
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr' }} gap={3}>
            <Field.Text name="unloadingWeight" label="Unloading Weight" type="number" required />

            {isOwn ? (
              <Field.Text name="endKm" label="End Km" type="number" required />
            ) : (
              <Field.Text
                name="commissionRate"
                label="Transporter Commission Rate"
                type="number"
                required
              />
            )}

            <Field.DatePicker name="endDate" label="LR Receive Date *" />
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
            sx={{ mt: 3 }}
            gap={1}
          >
            <Field.Switch name="hasShortage" label="Has Shortage" color="warning" />
            <Field.Switch name="hasError" label="Has Error" color="error" />
          </Box>

          {hasShortage && (
            <>
              <Field.Text
                name="shortageWeight"
                label="Shortage Weight"
                type="number"
                sx={{ mt: 3 }}
              />
              <Field.Text
                name="shortageAmount"
                label="Shortage Amount"
                type="number"
                sx={{ mt: 3 }}
              />
            </>
          )}

          {hasError && (
            <Field.Text
              name="remarks"
              label="Error Remarks"
              type="text"
              multiline
              rows={3}
              sx={{ mt: 3 }}
            />
          )}
        </>
      )}
    </Card>
  );
};

export function SubtripReceiveForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSubtripId = searchParams.get('currentSubtrip');
  const redirectTo = searchParams.get('redirectTo');

  const subtripDialog = useBoolean();
  const [selectedSubtripId, setSelectedSubtripId] = useState(() => currentSubtripId || null);

  const { data: loadedSubtrips = [], isLoading: loadingLoadedSubtrips } = useLoadedSubtrips();

  const {
    data: selectedSubtripData,
    isLoading: isLoadingSelectedSubtrip,
    error: selectedSubtripError,
  } = useSubtrip(selectedSubtripId);

  const receiveSubtrip = useUpdateSubtripReceiveInfo();

  const methods = useForm({
    resolver: zodResolver(receiveSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const handleSubtripChange = useCallback(
    (subtrip) => {
      setSelectedSubtripId(subtrip._id);
      reset({ ...defaultValues, subtripId: subtrip._id });
    },
    [reset]
  );

  const onSubmit = async (data) => {
    try {
      console.log('form data', data);
      // await receiveSubtrip({ id: selectedSubtripData._id, data });
      reset(defaultValues);
      setSelectedSubtripId(null);
      if (redirectTo) navigate(redirectTo);
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  return (
    <>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <ReceiveFormFields
          selectedSubtrip={selectedSubtripData}
          methods={methods}
          errors={errors}
          subtripDialog={subtripDialog}
          isLoading={isLoadingSelectedSubtrip}
        />

        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => {
              reset(defaultValues);
              setSelectedSubtripId(null);
            }}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid}
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </Form>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          {selectedSubtripData && <BasicExpenseTable selectedSubtrip={selectedSubtripData} />}
        </Grid>
        <Grid item xs={12} md={4}>
          {selectedSubtripData && <SubtripDetailCard selectedSubtrip={selectedSubtripData} />}
        </Grid>
      </Grid>

      <KanbanSubtripDialog
        open={subtripDialog.value}
        onClose={subtripDialog.onFalse}
        selectedSubtrip={selectedSubtripData}
        onSubtripChange={handleSubtripChange}
        subtrips={loadedSubtrips}
        isLoading={loadingLoadedSubtrips}
        dialogTitle="Select Subtrip to Receive"
      />
    </>
  );
}
