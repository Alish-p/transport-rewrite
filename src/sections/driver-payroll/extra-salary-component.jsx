/* eslint-disable react/prop-types */
import { useFieldArray, useFormContext } from 'react-hook-form';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { Button, Divider, Typography } from '@mui/material';

import { Field } from 'src/components/hook-form';

import { Iconify } from '../../components/iconify';

export default function ExtraSalaryComponent() {
  const { control } = useFormContext();
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

  const handleRemoveSalaryComponent = (index) => {
    remove(index);
  };

  return (
    <>
      <Typography sx={{ p: 1, mb: 1 }} variant="h6" color="green">
        Please Select Extra Salary Component
      </Typography>
      <Card sx={{ p: 3, mb: 3 }}>
        {fields.map((field, index) => (
          <Grid container spacing={2} sx={{ mb: 2 }}>
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
            <Grid item xs={12} md={3}>
              <Field.Select
                name={`otherSalaryComponent[${index}].paymentType`}
                label="Payment Type"
              >
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
            </Grid>
            <Grid item xs={12} md={3}>
              <Field.Text name={`otherSalaryComponent[${index}].remarks`} label="Remarks" />
            </Grid>
            <Grid item xs={12} md={3}>
              <Field.Text
                name={`otherSalaryComponent[${index}].amount`}
                label="Amount"
                type="number"
              />
            </Grid>
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
        <Button size="medium" variant="outlined" color="success" onClick={handleAddSalaryComponent}>
          + Add Salary Item
        </Button>
      </Card>
    </>
  );
}
