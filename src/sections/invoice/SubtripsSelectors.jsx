/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { Card, Grid, Button, Divider, MenuItem } from '@mui/material';

import { fetchFilteredSubtrips, resetFilteredSubtrips } from 'src/redux/slices/subtrip';

import { Field } from 'src/components/hook-form';

/** Custom hook to handle fetching logic */
const useFetchFilteredSubtrips = (customerId, fromDate, toDate, dispatch) => {
  const { setValue } = useFormContext();

  const fetchCustomerSubtrips = () => {
    if (customerId && fromDate && toDate) {
      dispatch(fetchFilteredSubtrips('customer', customerId, fromDate, toDate));
      setValue('selectedSubtrips', []); // Reset selected subtrips
    }
  };

  return { fetchCustomerSubtrips };
};

/** Reusable Field Wrapper */
const FieldWrapper = ({ children, ...props }) => (
  <Grid item xs={12} md={props.md || 3}>
    {children}
  </Grid>
);

/** Customer Dropdown */
const CustomerDropdown = ({ customersList }) => (
  <Field.Select name="customerId" label="Customer">
    <MenuItem value="">None</MenuItem>
    <Divider sx={{ borderStyle: 'dashed' }} />
    {customersList.map((customer) => (
      <MenuItem key={customer._id} value={customer._id}>
        {customer.customerName}
      </MenuItem>
    ))}
  </Field.Select>
);

/** Subtrips MultiSelect */
const SubtripsMultiSelect = ({ filteredSubtrips }) =>
  filteredSubtrips.length > 0 && (
    <Field.MultiSelect
      checkbox
      name="selectedSubtrips"
      label="Subtrips"
      options={filteredSubtrips.map((subtrip) => ({
        label: subtrip._id,
        value: subtrip._id,
      }))}
      sx={{ width: '100%' }}
    />
  );

/** Main Component */
export default function SubtripsSelectors({ customersList }) {
  const { watch, setValue } = useFormContext();
  const dispatch = useDispatch();
  const { filteredSubtrips } = useSelector((state) => state.subtrip);

  const { customerId, fromDate, toDate } = watch();
  const { fetchCustomerSubtrips } = useFetchFilteredSubtrips(
    customerId,
    fromDate,
    toDate,
    dispatch
  );

  useEffect(() => {
    setValue('selectedSubtrips', []); // Reset selected subtrips on changes of fields
  }, [customerId, fromDate, toDate, setValue]);

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
          <CustomerDropdown customersList={customersList} />
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
            onClick={fetchCustomerSubtrips}
          >
            {'>'}
          </Button>
        </FieldWrapper>

        <FieldWrapper md={4}>
          <SubtripsMultiSelect filteredSubtrips={filteredSubtrips} />
        </FieldWrapper>
      </Grid>
    </Card>
  );
}
