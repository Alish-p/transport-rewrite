import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Tab,
  Tabs,
  Dialog,
  Button,
  Tooltip,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';

import { today } from 'src/utils/format-time';

import { useUpdateSubtripReceiveInfo } from 'src/query/use-subtrip';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { loadingWeightUnit } from '../vehicle/vehicle-config';

// ----------------------------------------------------------------------

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

// ----------------------------------------------------------------------

const validationSchema = zod
  .object({
    unloadingWeight: zod.number({ required_error: 'Unloading weight is required' }),
    endKm: zod.number({ required_error: 'End Km is required' }),
    endDate: schemaHelper.date({ message: { required_error: 'End date is required!' } }),
    commissionRate: zod
      .number()
      .min(0, { message: 'Commission rate cannot be negative' })
      .optional(),
    hasError: zod.boolean(),
    errorRemarks: zod.string().optional(),
    shortageWeight: zod.number().optional(),
    shortageAmount: zod.number().optional(),
  })
  .superRefine((values, ctx) => {
    // Validate unloadingWeight <= loadingWeight
    if (values.unloadingWeight > values.loadingWeight) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'Unloading weight must be less than or equal to loading weight',
        path: ['unloadingWeight'],
      });
    }

    // Validate endKm >= startKm
    if (values.endKm < values.startKm) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'End Km must be greater than or equal to Start Km',
        path: ['endKm'],
      });
    }
  });

// ---------------------------------------------------------------

export function RecieveSubtripDialog({ showDialog, setShowDialog, subtrip }) {
  const [tabValue, setTabValue] = useState(0);
  const receiveSubtrip = useUpdateSubtripReceiveInfo();
  const { _id, loadingWeight, startKm, tripId } = subtrip;

  const { vehicleType, isOwn, trackingLink } = tripId.vehicleId;

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const defaultValues = useMemo(
    () => ({
      unloadingWeight: subtrip?.loadingWeight || 0,
      endKm: subtrip?.startKm || 0,
      endDate: today(),
      commissionRate: 0,
      hasError: false,
      errorRemarks: '',
      shortageWeight: 0,
      shortageAmount: 0,
    }),
    [subtrip]
  );

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await receiveSubtrip({ id: _id, data });
      reset(defaultValues);
      setShowDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!showDialog) {
      reset(defaultValues);
      setTabValue(0);
    }
  }, [showDialog, reset, defaultValues]);

  const values = watch();

  return (
    <Dialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      fullWidth
      maxWidth="sm"
      sx={{ minHeight: '30vh', overflow: 'auto' }}
    >
      <DialogTitle>Receive Subtrip</DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: '6px' }}>
          <Form methods={methods} onSubmit={onSubmit}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Basic Info" icon={<Iconify icon="mdi:truck-outline" />} />
              <Tab label="Shortage / Damage" icon={<Iconify icon="mdi:alert-circle-outline" />} />
              <Tab label="Error Info" icon={<Iconify icon="mdi:alert-octagon-outline" />} />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                }}
              >
                <Field.Text
                  name="unloadingWeight"
                  label="Unloading Wt."
                  type="number"
                  required
                  autoFocus
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {' '}
                        ≤ {loadingWeight} {loadingWeightUnit[vehicleType]}
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
                        endAdornment: (
                          <InputAdornment position="end">≥ {startKm} Km</InputAdornment>
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

                {!tripId?.vehicleId?.isOwn && (
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
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                }}
              >
                <>
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
                </>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                }}
              >
                <Field.Switch name="hasError" label="Has error ?" />

                <Field.Text
                  name="errorRemarks"
                  label="Error Remarks"
                  type="text"
                  multiline
                  rows={2}
                  disabled={!values.hasError}
                />
              </Box>
            </TabPanel>
          </Form>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          type="reset"
          onClick={() => reset(defaultValues)}
          variant="outlined"
          loading={isSubmitting}
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
