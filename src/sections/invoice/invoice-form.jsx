import { useCallback } from 'react';

import { Card, Grid, Button, FormHelperText } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { CustomDateRangePicker } from 'src/components/custom-date-range-picker/custom-date-range-picker';

import { useBoolean } from '../../hooks/use-boolean';
import { useInvoice } from './context/InvoiceContext';
import { SubtripsDialog } from './components/SubtripsDialog';
import { KanbanCustomerDialog } from '../kanban/components/kanban-customer-dialog';

/** Reusable Field Wrapper */
const FieldWrapper = ({ children, error, ...props }) => (
  <Grid item xs={12} md={props.md || 3}>
    {children}
    {error && <FormHelperText error>{error}</FormHelperText>}
  </Grid>
);

/** Customer Selector */
const CustomerSelector = ({ value, onChange, error }) => {
  const customerDialog = useBoolean();
  const { customerList } = useInvoice();

  const selectedCustomer = customerList.find((customer) => customer._id === value);

  const handleCustomerChange = useCallback(
    (customer) => {
      onChange({ customerId: customer._id });
    },
    [onChange]
  );

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        onClick={customerDialog.onTrue}
        sx={{
          height: 56,
          justifyContent: 'flex-start',
          typography: 'body2',
        }}
        startIcon={
          <Iconify
            icon={selectedCustomer ? 'mdi:office-building' : 'mdi:office-building-outline'}
            sx={{ color: selectedCustomer ? 'primary.main' : 'text.disabled' }}
          />
        }
      >
        {selectedCustomer ? selectedCustomer.customerName : 'Select Customer'}
      </Button>

      <KanbanCustomerDialog
        open={customerDialog.value}
        onClose={customerDialog.onFalse}
        onCustomerChange={handleCustomerChange}
        selectedCustomer={selectedCustomer}
      />
    </>
  );
};

/** Date Range Selector */
const DateRangeSelector = ({ fromDate, toDate, onChange, error }) => {
  const dateRangeDialog = useBoolean();

  const handleStartDateChange = useCallback(
    (date) => {
      onChange({ fromDate: date });
    },
    [onChange]
  );

  const handleEndDateChange = useCallback(
    (date) => {
      onChange({ toDate: date });
    },
    [onChange]
  );

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        size="small"
        onClick={dateRangeDialog.onTrue}
        startIcon={
          <Iconify
            icon={fromDate && toDate ? 'mdi:calendar' : 'mdi:calendar-outline'}
            sx={{ color: fromDate && toDate ? 'primary.main' : 'text.disabled' }}
          />
        }
        sx={{
          height: 56,
          justifyContent: 'flex-start',
          typography: 'body2',
        }}
      >
        {fromDate && toDate
          ? `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
          : 'Select Date Range'}
      </Button>

      <CustomDateRangePicker
        open={dateRangeDialog.value}
        onClose={dateRangeDialog.onFalse}
        startDate={fromDate}
        endDate={toDate}
        onChangeStartDate={handleStartDateChange}
        onChangeEndDate={handleEndDateChange}
        error={error}
      />
    </>
  );
};

/** Subtrip Selector */
const SubtripSelector = ({ subtrips, selectedSubtrips, onChange, error }) => {
  const subtripsDialog = useBoolean();

  const handleSubtripsChange = useCallback(
    (newSelectedSubtrips) => {
      onChange({ invoicedSubTrips: newSelectedSubtrips });
    },
    [onChange]
  );

  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        sx={{
          height: 56,
          justifyContent: 'flex-start',
          typography: 'body2',
        }}
        onClick={subtripsDialog.onTrue}
        startIcon={
          <Iconify
            icon={selectedSubtrips?.length > 0 ? 'mdi:check' : 'mdi:check-outline'}
            sx={{ color: selectedSubtrips?.length > 0 ? 'primary.main' : 'text.disabled' }}
          />
        }
      >
        {selectedSubtrips?.length > 0 ? selectedSubtrips.join(', ') : 'Select Subtrips'}
      </Button>

      <SubtripsDialog
        open={subtripsDialog.value}
        onClose={subtripsDialog.onFalse}
        subtrips={subtrips}
        selectedSubtrips={selectedSubtrips}
        onChange={handleSubtripsChange}
        title="Select Subtrips for Invoice"
      />
    </>
  );
};

/** Main Component */
export default function InvoiceForm() {
  const { formState, updateFormState, fetchSubtrips, allSubTripsByCustomer, errors } = useInvoice();

  const { customerId, fromDate, toDate, invoicedSubTrips } = formState;

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2}>
        <FieldWrapper error={errors?.customerId}>
          <CustomerSelector
            value={customerId}
            onChange={updateFormState}
            error={errors?.customerId}
          />
        </FieldWrapper>

        <FieldWrapper md={2} error={errors?.fromDate || errors?.toDate}>
          <DateRangeSelector
            fromDate={fromDate}
            toDate={toDate}
            onChange={updateFormState}
            error={errors?.fromDate || errors?.toDate}
          />
        </FieldWrapper>

        <FieldWrapper md={1}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: 56, justifyContent: 'flex-start', typography: 'body2' }}
            onClick={fetchSubtrips}
            startIcon={<Iconify icon="mdi:pointer" />}
          >
            Fetch Subtrips
          </Button>
        </FieldWrapper>

        {/* only show if there are subtrips */}
        {allSubTripsByCustomer?.length > 0 && (
          <FieldWrapper md={6} error={errors?.invoicedSubTrips}>
            <SubtripSelector
              subtrips={allSubTripsByCustomer}
              selectedSubtrips={invoicedSubTrips}
              onChange={updateFormState}
              error={errors?.invoicedSubTrips}
            />
          </FieldWrapper>
        )}
      </Grid>
    </Card>
  );
}
