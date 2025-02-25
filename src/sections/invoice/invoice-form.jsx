/* eslint-disable react/prop-types */
import { useFormContext } from 'react-hook-form';

import { Card, Grid, Button, Divider, MenuItem } from '@mui/material';

import { Field } from 'src/components/hook-form';

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
  filteredSubtrips &&
  filteredSubtrips.length > 0 && (
    <Field.MultiSelect
      checkbox
      name="invoicedSubTrips"
      label="Subtrips"
      options={filteredSubtrips.map((subtrip) => ({
        label: subtrip._id,
        value: subtrip._id,
      }))}
      sx={{ width: '100%' }}
    />
  );

/** Main Component */
export default function InvoiceForm({ customersList, filteredSubtrips, onFetchSubtrips }) {
  const { watch, setValue } = useFormContext();

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
            onClick={onFetchSubtrips}
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
