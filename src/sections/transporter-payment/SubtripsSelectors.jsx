/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Divider, Typography } from '@mui/material';

import { fetchClosedSubtripsByTransporterAndDate } from 'src/redux/slices/subtrip';

import { Field } from 'src/components/hook-form';

export default function SubtripsSelectors({ transporterList }) {
  const { setValue, watch } = useFormContext();
  const [subtrips, setSubtrips] = useState([]);

  const { transporterId, periodStartDate, periodEndDate } = watch();

  const fetchCompletedSubtrips = async () => {
    const completedSubtripData = await fetchClosedSubtripsByTransporterAndDate(
      transporterId,
      periodStartDate,
      periodEndDate
    );
    setSubtrips(completedSubtripData);
    setValue('completedSubtripData', completedSubtripData);
    setValue('selectedSubtrips', []);
  };

  return (
    <>
      <Typography sx={{ p: 1, mb: 1 }} variant="h6" color="green">
        Please Select the Trips.
      </Typography>
      <Card sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Field.Select name="transporterId" label="Transporter">
              <MenuItem value="">None</MenuItem>
              <Divider sx={{ borderStyle: 'dashed' }} />
              {transporterList.map((transporter) => (
                <MenuItem key={transporter._id} value={transporter._id}>
                  {transporter.transportName}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid>
          <Grid item xs={12} md={2}>
            <Field.DatePicker name="periodStartDate" label="Start Date" />
          </Grid>
          <Grid item xs={12} md={2}>
            <Field.DatePicker name="periodEndDate" label="End Date" />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ height: '100%', width: '50%' }}
              onClick={fetchCompletedSubtrips}
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
    </>
  );
}
