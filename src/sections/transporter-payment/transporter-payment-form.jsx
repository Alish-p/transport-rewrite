/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { Card, Grid, Button, Divider, MenuItem, Typography } from '@mui/material';

import { fetchFilteredSubtrips, resetFilteredSubtrips } from 'src/redux/slices/subtrip';

import { Field } from 'src/components/hook-form';

/** Custom hook to handle fetching logic */

const useFetchFilteredSubtrips = (transporterId, fromDate, toDate, dispatch) => {
  const { setValue } = useFormContext();

  const fetchTransporterSubtrips = () => {
    if (transporterId && fromDate && toDate) {
      dispatch(fetchFilteredSubtrips('transporter', transporterId, fromDate, toDate));

      setValue('associatedSubtrips', []);
    }
  };

  return { fetchTransporterSubtrips };
};

/** Reusable Field Wrapper */
const FieldWrapper = ({ children, ...props }) => (
  <Grid item xs={12} md={props.md || 3}>
    {children}
  </Grid>
);

/** Transporter Dropdown */
const TransporterDropdown = ({ transportersList }) => (
  <Field.Select name="transporterId" label="Transporter">
    <MenuItem value="">None</MenuItem>
    <Divider sx={{ borderStyle: 'dashed' }} />
    {transportersList.map((transporter) => (
      <MenuItem key={transporter._id} value={transporter._id}>
        {transporter.transportName}
      </MenuItem>
    ))}
  </Field.Select>
);

/** Subtrips MultiSelect */
const SubtripsMultiSelect = ({ filteredSubtrips }) =>
  filteredSubtrips.length > 0 && (
    <Field.MultiSelect
      checkbox
      name="associatedSubtrips"
      label="Subtrips"
      options={filteredSubtrips.map((subtrip) => ({
        label: subtrip._id,
        value: subtrip._id,
      }))}
      sx={{ width: '100%' }}
    />
  );

const RenderRepaymentComponent = ({ loans }) => (
  <Grid container spacing={1} sx={{ m: 1, p: 1 }} key="index">
    <Field.MultiCheckbox
      column
      name="selectedLoans"
      label="Loans"
      options={loans?.map((loan) => ({
        label: `Total Amount: ₹${loan?.totalAmount} | Installment Amount: ${loan?.installmentAmount} | Remarks: ${loan?.remarks}`,
        value: loan._id,
      }))}
    />
  </Grid>
);

/** Main Component */
export default function TransporterPaymentForm({ transportersList, loans }) {
  const dispatch = useDispatch();
  const { watch, setValue } = useFormContext();
  const { filteredSubtrips } = useSelector((state) => state.subtrip);

  const { transporterId, fromDate, toDate } = watch();
  const { fetchTransporterSubtrips } = useFetchFilteredSubtrips(
    transporterId,
    fromDate,
    toDate,
    dispatch
  );

  // Reset selected subtrips on changes of fields
  useEffect(() => {
    setValue('associatedSubtrips', []);
    dispatch(resetFilteredSubtrips());
  }, [transporterId, fromDate, toDate, setValue, dispatch]);

  // Reset the filtered subtrips on unmount
  useEffect(
    () => () => {
      dispatch(resetFilteredSubtrips());
    },
    [dispatch]
  );

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2}>
        <FieldWrapper>
          <TransporterDropdown transportersList={transportersList} />
        </FieldWrapper>

        <FieldWrapper md={2}>
          <Field.DatePicker name="fromDate" label="From Date" />
        </FieldWrapper>

        <FieldWrapper md={2}>
          <Field.DatePicker name="toDate" label="To Date" />
        </FieldWrapper>

        <FieldWrapper md={1}>
          <Button
            type="button"
            variant="contained"
            fullWidth
            sx={{ height: '100%', width: '50%' }}
            onClick={fetchTransporterSubtrips}
          >
            {'>'}
          </Button>
        </FieldWrapper>

        <FieldWrapper md={4}>
          <SubtripsMultiSelect filteredSubtrips={filteredSubtrips} />
        </FieldWrapper>
      </Grid>

      {/* Loan Selector */}
      {loans && loans.length > 0 && transporterId && (
        <Grid sx={{ my: 2 }}>
          <Typography sx={{ p: 1, mb: 1 }} variant="h6" color="green">
            These are some pending loans of the transporter. Select the loans to repay.
          </Typography>

          <RenderRepaymentComponent loans={loans} />
          <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
        </Grid>
      )}
    </Card>
  );
}
