import { useState, useEffect } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Chip,
  Stack,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

const vehicleTypeSuggestions = [
  { type: 'Body', tyres: [12, 16, 12, 14, 16] },
  { type: 'Trailer', tyres: [12, 16, 20] },
  { type: 'Bulker', tyres: [16, 20] },
  { type: 'Local Bulker', tyres: [12, 16] },
  { type: 'Tanker', tyres: [16, 20] },
  { type: 'Pickup', tyres: [4, 6] },
  { type: 'Crane', tyres: [10, 12, 16] },
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function SmartConfigAssistant({ onApply, editingConfig, onUpdate }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [config, setConfig] = useState({});

  useEffect(() => {
    if (editingConfig) {
      setConfig(editingConfig);
      setOpenDialog(true);
    }
  }, [editingConfig]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleVehicleTypeSelect = (type, tyres) => {
    setConfig((prev) => ({ ...prev, vehicleType: type, noOfTyres: tyres }));
  };

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleFinish = () => {
    if (editingConfig) {
      onUpdate(config);
    } else {
      onApply(config);
    }
    setOpenDialog(false);
    setTabValue(0);
    setConfig({});
  };

  const renderVehicleTypeTab = () => (
    <Stack spacing={2}>
      {vehicleTypeSuggestions.map((vehicle) => (
        <Box key={vehicle.type}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {vehicle.type}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {vehicle.tyres.map((tyres) => (
              <Chip
                key={tyres}
                label={`${tyres} Tyres`}
                onClick={() => handleVehicleTypeSelect(vehicle.type, tyres)}
                color={
                  config.vehicleType === vehicle.type && config.noOfTyres === tyres
                    ? 'primary'
                    : 'default'
                }
              />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );

  const renderFuelExpensesTab = () => (
    <Box
      rowGap={3}
      columnGap={2}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
      }}
    >
      <TextField
        label="Toll Amount"
        type="number"
        value={config.tollAmt || ''}
        onChange={(e) => handleChange('tollAmt', Number(e.target.value))}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">₹</InputAdornment>,
        }}
      />

      <TextField
        label="Diesel"
        type="number"
        value={config.diesel || ''}
        onChange={(e) => handleChange('diesel', Number(e.target.value))}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">L</InputAdornment>,
        }}
      />
      <TextField
        label="AdBlue"
        type="number"
        value={config.adBlue || ''}
        onChange={(e) => handleChange('adBlue', Number(e.target.value))}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">L</InputAdornment>,
        }}
      />
      <TextField
        label="Fixed Mileage"
        type="number"
        value={config.fixMilage || ''}
        onChange={(e) => handleChange('fixMilage', Number(e.target.value))}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">KM/L</InputAdornment>,
        }}
      />
      <TextField
        label="Performance Mileage"
        type="number"
        value={config.performanceMilage || ''}
        onChange={(e) => handleChange('performanceMilage', Number(e.target.value))}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">KM/L</InputAdornment>,
        }}
      />
    </Box>
  );

  const renderSalaryTab = () => (
    <Box
      rowGap={3}
      columnGap={2}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
      }}
    >
      <TextField
        label="Fixed Salary"
        type="number"
        value={config.fixedSalary || ''}
        onChange={(e) => handleChange('fixedSalary', Number(e.target.value))}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">₹</InputAdornment>,
        }}
      />
      <TextField
        label="Percentage Salary"
        type="number"
        value={config.percentageSalary || ''}
        onChange={(e) => handleChange('percentageSalary', Number(e.target.value))}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
      />

      <TextField
        label="Advance Amount"
        type="number"
        value={config.advanceAmt || ''}
        onChange={(e) => handleChange('advanceAmt', Number(e.target.value))}
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">₹</InputAdornment>,
        }}
      />
    </Box>
  );

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<Iconify icon="mdi:plus" />}
        onClick={() => setOpenDialog(true)}
      >
        {editingConfig ? 'Edit Configuration' : 'Add Configuration'}
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingConfig ? 'Edit Configuration' : 'Add New Configuration'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Vehicle Type" icon={<Iconify icon="mdi:truck" />} />
              <Tab label="Fuel & Expenses" icon={<Iconify icon="mdi:fuel" />} />
              <Tab label="Salary Structure" icon={<Iconify icon="mdi:cash-multiple" />} />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              {renderVehicleTypeTab()}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {renderFuelExpensesTab()}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              {renderSalaryTab()}
            </TabPanel>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleFinish} variant="contained" color="primary">
            {editingConfig ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
