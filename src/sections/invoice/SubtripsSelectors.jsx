/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import { fetchCustomers } from 'src/redux/slices/customer';
import { fetchClosedTripsByCustomerAndDate } from 'src/redux/slices/subtrip';

import { Field } from 'src/components/hook-form';

export default function SubtripsSelectors() {
  const { setValue, handleSubmit, watch } = useFormContext();
  const dispatch = useDispatch();
  const { customers, isLoading } = useSelector((state) => state.customer);
  const [subtrips, setSubtrips] = useState([]);

  const customerId = watch('customerId');
  const fromDate = watch('fromDate');
  const toDate = watch('toDate');

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const onSubmit = async () => {
    const closedSubtripData = await fetchClosedTripsByCustomerAndDate(customerId, fromDate, toDate);
    setSubtrips(closedSubtripData);
    setValue('selectedSubtrips', []);
  };

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Field.Select name="customerId" label="Customer">
              <MenuItem value="">Select Customer</MenuItem>
              {isLoading ? (
                <MenuItem>Loading...</MenuItem>
              ) : (
                customers.map((customer) => (
                  <MenuItem key={customer._id} value={customer}>
                    {customer.customerName}
                  </MenuItem>
                ))
              )}
            </Field.Select>
          </Grid>
          <Grid item xs={12} md={2}>
            <Field.DatePicker name="fromDate" label="From Date" />
          </Grid>
          <Grid item xs={12} md={2}>
            <Field.DatePicker name="toDate" label="To Date" />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ height: '100%', width: '50%' }}
            >
              {'>'}
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            {subtrips.length > 0 && (
              <Field.MultiSelect
                checkbox
                name="selectedSubtrips"
                label="Subtrips"
                options={subtrips.map((subtrip) => ({ label: subtrip._id, value: subtrip._id }))}
                sx={{ width: '100%' }}
              />
            )}
          </Grid>
        </Grid>
      </form>
    </Card>
  );
}
