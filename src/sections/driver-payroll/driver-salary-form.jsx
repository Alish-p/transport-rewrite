/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Divider, Typography } from '@mui/material';

import { fetchFilteredSubtrips, resetFilteredSubtrips } from 'src/redux/slices/subtrip';

import { Field } from 'src/components/hook-form';

import { Iconify } from '../../components/iconify';
import { useDispatch, useSelector } from '../../redux/store';

/** Custom hook to handle fetching logic */
const useFetchFilteredSubtrips = (driverId, periodStartDate, periodEndDate, dispatch) => {
  const { setValue } = useFormContext();

  const fetchDriverSubtrips = () => {
    if (driverId && periodStartDate && periodEndDate) {
      dispatch(fetchFilteredSubtrips('driver', driverId, periodStartDate, periodEndDate));

      setValue('subtripComponents', []); // Reset selected subtrips
    }
  };

  return { fetchDriverSubtrips };
};

/** Reusable Field Wrapper */
const FieldWrapper = ({ children, ...props }) => (
  <Grid item xs={12} md={props.md || 3}>
    {children}
  </Grid>
);

/** Driver Dropdown */
const DriverDropdown = ({ driversList }) => (
  <Field.Select name="driverId" label="Driver">
    <MenuItem value="">None</MenuItem>
    <Divider sx={{ borderStyle: 'dashed' }} />
    {driversList.map((driver) => (
      <MenuItem key={driver._id} value={driver._id}>
        {driver.driverName}
      </MenuItem>
    ))}
  </Field.Select>
);

/** Subtrips MultiSelect */
const SubtripsMultiSelect = ({ filteredSubtrips }) =>
  filteredSubtrips.length > 0 && (
    <Field.MultiSelect
      checkbox
      name="subtripComponents"
      label="Subtrips"
      options={filteredSubtrips.map((subtrip) => ({
        label: subtrip._id,
        value: subtrip._id,
      }))}
      sx={{ width: '100%' }}
    />
  );

/** Render Extra Salary Component */
const RenderOtherSalaryComponent = ({ fields, remove }) => {
  const handleRemoveSalaryComponent = (index) => {
    remove(index);
  };

  return (
    <>
      {fields.map((field, index) => (
        <Grid container spacing={2} sx={{ mb: 2 }} key={field.id}>
          <Grid
            item
            xs={12}
            md={1}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {index + 1}
          </Grid>
          <FieldWrapper>
            <Field.Select name={`otherSalaryComponent[${index}].paymentType`} label="Payment Type">
              <MenuItem value="">None</MenuItem>
              <Divider sx={{ borderStyle: 'dashed' }} />
              {[
                { key: 'fixedSalary', value: 'Fixed Salary' },
                { key: 'penalty', value: 'Penalty Deduction' },
              ].map(({ value, key }) => (
                <MenuItem key={key} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Field.Select>
          </FieldWrapper>
          <FieldWrapper>
            <Field.Text name={`otherSalaryComponent[${index}].remarks`} label="Remarks" />
          </FieldWrapper>
          <FieldWrapper>
            <Field.Text
              name={`otherSalaryComponent[${index}].amount`}
              label="Amount"
              type="number"
            />
          </FieldWrapper>
          <Grid
            item
            xs={12}
            md={2}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => handleRemoveSalaryComponent(index)}
            >
              Remove
            </Button>
          </Grid>
        </Grid>
      ))}
    </>
  );
};

const RenderRepaymentComponent = ({ loans }) => (
  <Grid container spacing={1} sx={{ m: 1, p: 1 }} key="index">
    <Field.MultiCheckbox
      column
      name="selectedLoans"
      label="Loans"
      options={loans?.map(({ loan }, index) => ({
        label: `(${loan.borrowerType}) Principal: ₹${loan.principalAmount} | Interest: ${loan.interestRate}% | Tenure: ${loan.tenure} months | EMI: ₹${loan.emiAmount} | Total Payable: ₹${loan.totalAmount} | Remaining: ₹${loan.remainingBalance}${loan.remarks ? ` | Remarks: ${loan.remarks}` : ''}`,
        value: loan._id,
      }))}
      sx={{ gap: 4 }}
    />
  </Grid>
);

export default function DriverSalaryForm({ driversList, loans }) {
  const dispatch = useDispatch();
  const { watch, setValue, control } = useFormContext();
  const { filteredSubtrips } = useSelector((state) => state.subtrip);

  const { driverId, periodStartDate, periodEndDate } = watch();
  const { fetchDriverSubtrips } = useFetchFilteredSubtrips(
    driverId,
    periodStartDate,
    periodEndDate,
    dispatch
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'otherSalaryComponent',
  });

  const handleAddSalaryComponent = () => {
    append({
      paymentType: '',
      amount: 0,
      remarks: '',
    });
  };

  // Reset selected subtrips on changes of fields
  useEffect(() => {
    setValue('subtripComponents', []);
    dispatch(resetFilteredSubtrips());
  }, [driverId, periodStartDate, periodEndDate, setValue, dispatch]);

  // Reset the filtered subtrips on unmount
  useEffect(
    () => () => {
      dispatch(resetFilteredSubtrips());
    },
    [dispatch]
  );

  return (
    <>
      <Typography sx={{ p: 1, mb: 1 }} variant="h6" color="green">
        Please Select the Trips Completed By Driver.
      </Typography>

      <Card sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <FieldWrapper>
            <DriverDropdown driversList={driversList} />
          </FieldWrapper>

          <FieldWrapper md={2}>
            <Field.DatePicker name="periodStartDate" label="Start Date" />
          </FieldWrapper>

          <FieldWrapper md={2}>
            <Field.DatePicker name="periodEndDate" label="End Date" />
          </FieldWrapper>

          <FieldWrapper md={1}>
            <Button
              type="button"
              variant="contained"
              fullWidth
              sx={{ height: '100%', width: '50%' }}
              onClick={fetchDriverSubtrips}
            >
              {'>'}
            </Button>
          </FieldWrapper>

          <FieldWrapper md={4}>
            <SubtripsMultiSelect filteredSubtrips={filteredSubtrips} />
          </FieldWrapper>
        </Grid>
      </Card>

      <Typography sx={{ p: 1, mb: 1 }} variant="h6" color="green">
        Please Select Extra Salary Component
      </Typography>

      <Card sx={{ p: 3, mb: 3 }}>
        <RenderOtherSalaryComponent fields={fields} remove={remove} />
        <Button size="medium" variant="outlined" color="success" onClick={handleAddSalaryComponent}>
          + Add Salary Item
        </Button>
      </Card>

      {loans && loans.length > 0 && (
        <>
          <Typography sx={{ p: 1, mb: 1 }} variant="h6" color="green">
            These are some pending loans of the driver. Select the loans to repay.
          </Typography>

          <Card sx={{ p: 1, mb: 1 }}>
            <RenderRepaymentComponent loans={loans} />
          </Card>
        </>
      )}
    </>
  );
}
