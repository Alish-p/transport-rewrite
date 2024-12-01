import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Stack,
  Alert,
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

import { getSalaryDetailsByVehicleType } from '../../utils/utils';
import { Form, Field, schemaHelper } from '../../components/hook-form';

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
  ewayExpiryDate: schemaHelper.date({
    message: { required_error: 'EwayExpiry date is required!' },
  }),
  materialType: zod.string().optional(),
  quantity: zod.number().positive().int(),
  grade: zod.string().optional(),
  tds: zod.number().int().optional(),
  driverAdvance: zod.number().int().optional(),
  dieselLtr: zod.any(),
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
  dieselLtr: 'Full',
  pumpCd: '',
};

// ------------------------------------------------------------

export function SubtripMaterialInfoDialog({ showDialog, setShowDialog, subtrip }) {
  const { tripId, customerId, routeCd, _id } = subtrip;

  const vehicleId = tripId?.vehicleId?._id;
  const consignees = customerId?.consignees;

  const { advanceAmt } = getSalaryDetailsByVehicleType(routeCd, tripId?.vehicleId?.vehicleType);

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
      toast.error('Error !! ');
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

              <Field.Text
                name="loadingWeight"
                label="Loading Weight"
                type="number"
                placeholder={0}
              />
              <Field.Text name="startKm" label="Start Km" type="number" placeholder={0} />
              <Field.Text name="rate" label="Rate" type="number" placeholder={0} />
              <Field.Text name="invoiceNo" label="Invoice No" />
              <Field.Text name="shipmentNo" label="Shipment No" />
              <Field.Text name="orderNo" label="Order No" />
              <Field.Text name="ewayBill" label="Eway Bill" />
              <Field.DatePicker name="ewayExpiryDate" label="Eway Expiry Date" />
              <Field.Text name="materialType" label="Material Type" />
              <Field.Text name="quantity" label="Quantity" type="number" placeholder={0} />
              <Field.Text name="grade" label="Grade" />
              <Field.Text name="tds" label="TDS" type="number" required placeholder={0} />
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
                sm: 'repeat(3, 1fr)',
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
              <Field.Text name="driverAdvance" label="Driver Advance" type="number" />
              <Field.Text name="dieselLtr" label="Diesel" />
            </Box>
          </Form>

          <Alert severity="info" variant="outlined" sx={{ my: 2 }}>
            {`For this route, the usual driver advance is "${advanceAmt} ₹".`}
          </Alert>

          <Alert severity="success" variant="outlined" sx={{ my: 2 }}>
            {`Please select "Full Diesel" for a full tank or specify the quantity in liters.`}
          </Alert>
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
