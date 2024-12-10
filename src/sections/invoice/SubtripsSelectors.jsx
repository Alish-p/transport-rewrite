/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import { fetchClosedTripsByCustomerAndDate } from 'src/redux/slices/subtrip';

import { Field } from 'src/components/hook-form';

export default function SubtripsSelectors({ customersList }) {
  const { setValue, watch } = useFormContext();
  const [subtrips, setSubtrips] = useState([]);

  const { customerId, fromDate, toDate } = watch();

  const fetchCustomerSubtrips = async () => {
    const closedSubtripData = await fetchClosedTripsByCustomerAndDate(customerId, fromDate, toDate);
    setSubtrips(closedSubtripData);
    setValue('closedSubtripData', closedSubtripData);
    setValue('selectedSubtrips', []);
  };

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Field.Select name="customerId" label="Customer">
            <MenuItem value="">None</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {customersList.map((customer) => (
              <MenuItem key={customer._id} value={customer._id}>
                {customer.customerName}
              </MenuItem>
            ))}
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
            onClick={fetchCustomerSubtrips}
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
    </Card>
  );
}
