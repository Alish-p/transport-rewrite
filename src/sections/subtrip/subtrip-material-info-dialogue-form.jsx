import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Stack,
  Dialog,
  Button,
  Divider,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { fetchPumps } from 'src/redux/slices/pump';
import { addMaterialInfo } from 'src/redux/slices/subtrip';

import { toast } from 'src/components/snackbar';

import { Form, Field } from '../../components/hook-form';

const validationSchema = zod.object({
  consignee: zod
    .any()
    .nullable()
    .refine((val) => val !== null, { message: 'Consignee is required' }),
  loadingWeight: zod.number({ required_error: 'Loading Weight is required' }).positive().int(),
  startKm: zod.number().positive().int(),
  rate: zod.number().positive().int(),
  invoiceNo: zod.string().optional(),
  shipmentNo: zod.string().optional(),
  orderNo: zod.string().optional(),
  ewayBill: zod.string().optional(),
  ewayExpiryDate: zod.date().optional(),
  materialType: zod.string().optional(),
  quantity: zod.number().positive().int(),
  grade: zod.string().optional(),
  tds: zod.number().int().optional(),
  driverAdvance: zod.number().int().optional(),
  dieselLtr: zod.number().int().optional(),
  pumpCd: zod.string().optional(),
});

const defaultValues = {
  consignee: null,
  loadingWeight: 0,
  startKm: 0,
  rate: 0,
  invoiceNo: '',
  shipmentNo: '',
  orderNo: '',
  ewayBill: '',
  ewayExpiryDate: null,
  materialType: '',
  quantity: 0,
  grade: '',
  tds: 0,
  driverAdvance: 0,
  dieselLtr: 0,
  pumpCd: '',
};

// ------------------------------------------------------------

export function SubtripMaterialInfoDialog({ showDialog, setShowDialog, subtrip }) {
  const { tripId, customerId, routeCd, _id } = subtrip;

  const vehicleId = tripId?.vehicleId?._id;
  const consignees = customerId?.consignees;
  const advanceAmt = routeCd?.advanceAmt;

  const dispatch = useDispatch();

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleReset = () => {
    reset(defaultValues);
  };

  const onSubmit = async (data) => {
    try {
      // Dispatch action to update subtrip with material details\
      await dispatch(
        addMaterialInfo(_id, { ...data, vehicleId, consignee: data?.consignee?.value })
      );

      toast.success('Material details added successfully!');
      handleReset();
      setShowDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!showDialog) {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDialog]);

  useEffect(() => {
    if (showDialog) {
      dispatch(fetchPumps());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDialog]);

  const { pumps } = useSelector((state) => state.pump);

  return (
    <Dialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      fullWidth
      maxWidth={false}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <DialogTitle> Add Material Details </DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: '6px' }}>
          <Form methods={methods} onSubmit={onSubmit}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <Field.Autocomplete
                freeSolo
                name="consignee"
                label="consignee"
                options={consignees.map((c) => ({ label: c.name, value: c.name }))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />

              <Field.Text name="loadingWeight" label="Loading Weight" type="number" />
              <Field.Text name="startKm" label="Start Km" type="number" />
              <Field.Text name="rate" label="Rate" type="number" />
              <Field.Text name="invoiceNo" label="Invoice No" />
              <Field.Text name="shipmentNo" label="Shipment No" />
              <Field.Text name="orderNo" label="Order No" />
              <Field.Text name="ewayBill" label="Eway Bill" />
              <Field.DatePicker name="ewayExpiryDate" label="Eway Expiry Date" />
              <Field.Text name="materialType" label="Material Type" />
              <Field.Text name="quantity" label="Quantity" type="number" />
              <Field.Text name="grade" label="Grade" />
              <Field.Text name="tds" label="TDS" type="number" required />
            </Box>
            <Divider sx={{ marginBlock: '20px' }} />

            <Typography variant="h5" mb="20px">
              Advance Details
            </Typography>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Select native name="pumpCd" label="Pump">
                <option value="" />
                {pumps.map((pump) => (
                  <option key={pump._id} value={pump._id}>
                    {pump.pumpName}
                  </option>
                ))}
              </Field.Select>
              <Field.Text
                name="driverAdvance"
                label="Driver Advance"
                type="number"
                helperText={`Driver Advance for this Route is usually "${advanceAmt} ₹"`}
              />
            </Box>
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)', // Full width for each field on extra small screens
                sm: '65% 5% 20%', // Two columns for the second row
              }}
              columnGap={2}
              sx={{ mt: 3 }}
            >
              <Field.Text name="dieselLtr" label="Diesel (Ltr)" />
              <Typography sx={{ mt: 2, mx: 0, width: 1 }}>OR</Typography>
              <Field.Switch
                name="isFullTank"
                label="Full-Tank ?"
                labelPlacement="top"
                sx={{ width: 1 }}
              />
            </Box>
          </Form>
        </Box>
      </DialogContent>

      <DialogActions>
        <Stack direction="row" spacing={1}>
          <Button type="reset" onClick={handleReset} variant="outlined" loading={isSubmitting}>
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
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
