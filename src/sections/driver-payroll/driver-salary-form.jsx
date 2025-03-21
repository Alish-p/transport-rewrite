/* eslint-disable react/prop-types */
import { useFieldArray, useFormContext } from 'react-hook-form';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Divider, Typography } from '@mui/material';

import { Field } from 'src/components/hook-form';

import { Iconify } from '../../components/iconify';

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
  filteredSubtrips &&
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
      options={loans?.map((loan) => ({
        label: `Total Amount: ₹${loan?.totalAmount} | Installment Amount: ${loan?.installmentAmount} | Remarks: ${loan?.remarks}`,
        value: loan._id,
      }))}
    />
  </Grid>
);

export default function DriverSalaryForm({
  driversList,
  loans,
  filteredSubtrips,
  onFetchSubtrips,
}) {
  const { watch, setValue, control } = useFormContext();

  const { driverId, periodStartDate, periodEndDate } = watch();

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

  return (
    <>
      <Typography sx={{ p: 1, mb: 1 }} variant="h6" color="green">
        Driver Payroll Form
      </Typography>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography sx={{ p: 1, mb: 1 }} variant="h6" color="green">
          Please Select the Trips Completed By Driver.
        </Typography>

        {/* Trip Selector */}
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
              onClick={onFetchSubtrips}
            >
              {'>'}
            </Button>
          </FieldWrapper>

          <FieldWrapper md={4}>
            <SubtripsMultiSelect filteredSubtrips={filteredSubtrips} />
          </FieldWrapper>
        </Grid>

        {/* Loan Selector */}
        {loans && loans.length > 0 && driverId && (
          <Grid sx={{ my: 2 }}>
            <Typography sx={{ p: 1, mb: 1 }} variant="h6" color="green">
              These are some pending loans of the driver. Select the loans to repay.
            </Typography>

            <RenderRepaymentComponent loans={loans} />
            <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
          </Grid>
        )}

        {/* Other Salary Component  */}

        {driverId && (
          <Grid sx={{ my: 2 }}>
            <Typography sx={{ p: 1, mb: 1 }} variant="h6" color="green">
              Please Select Extra Salary Component
            </Typography>

            <RenderOtherSalaryComponent fields={fields} remove={remove} />
            <Button
              size="medium"
              variant="outlined"
              color="success"
              onClick={handleAddSalaryComponent}
            >
              + Add Salary Item
            </Button>

            <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
          </Grid>
        )}
      </Card>
    </>
  );
}
