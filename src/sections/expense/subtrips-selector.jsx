import { useState, useEffect } from 'react';

import { Box, Grid, Card, TextField, Typography, Autocomplete } from '@mui/material';

function SubtripSelector({ subtrips, currentSubtrip, onChangeSubtrip }) {
  const [selectedValue, setSelectedValue] = useState(currentSubtrip);

  useEffect(() => {
    setSelectedValue(currentSubtrip);
  }, [currentSubtrip]);

  const handleChange = (event, newValue) => {
    setSelectedValue(newValue);
    onChangeSubtrip(newValue);
  };

  return (
    <>
      <Grid container>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Subtrip
          </Typography>
        </Box>
      </Grid>

      <Card sx={{ p: 3, mb: 5 }}>
        <Autocomplete
          value={selectedValue}
          onChange={handleChange}
          options={[
            { _id: '', routeCd: { routeName: 'None' }, loadingPoint: '', unloadingPoint: '' },
            ...subtrips,
          ]}
          getOptionLabel={(option) =>
            option._id === ''
              ? 'None'
              : `${option._id} - ${option?.routeCd?.routeName} (${option?.loadingPoint} to ${option?.unloadingPoint})`
          }
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderInput={(params) => <TextField {...params} label="Select Subtrip" />}
        />
      </Card>
    </>
  );
}

export default SubtripSelector;
