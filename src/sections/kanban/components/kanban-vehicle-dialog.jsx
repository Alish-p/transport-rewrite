import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { FixedSizeList as List } from 'react-window';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';

import { useCreateVehicle, useVehiclesSummary } from 'src/query/use-vehicle';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';
import { SearchNotFound } from 'src/components/search-not-found';

// Import vehicle configuration
import { vehicleTypes } from 'src/sections/vehicle/vehicle-config';

// Import transporter dialog
import { KanbanTransporterDialog } from './kanban-transporter-dialog';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 74;
const LIST_HEIGHT = ITEM_HEIGHT * 6;

// Quick vehicle creation schema with minimal required fields
const QuickVehicleSchema = zod.object({
  vehicleNo: zod
    .string()
    .min(1, { message: 'Vehicle No is required' })
    .regex(/^[A-Z]{2}[0-9]{2}[A-Z]{0,2}[0-9]{4}$/, {
      message: 'Invalid Vehicle No format. Example: KA01AB0001, KA01A0001, or KA010001',
    }),
  vehicleType: zod.string().min(1, { message: 'Vehicle Type is required' }),
  noOfTyres: zod
    .number()
    .min(3, { message: 'No Of Tyres must be at least 3' })
    .max(30, { message: 'No Of Tyres cannot exceed 30' }),
  transporter: zod.string(),
});

// ----------------------------------------------------------------------

// Search input component
const SearchInput = ({ value, onChange }) => (
  <Box sx={{ px: 3, py: 2.5 }}>
    <TextField
      fullWidth
      value={value}
      onChange={onChange}
      placeholder="Search..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
    />
  </Box>
);

// Vehicle list item component for react-window

const VehicleItem = ({ data: { vehicles, selectedVehicle, onSelect }, index, style }) => {
  const vehicle = vehicles[index];
  const isSelected = selectedVehicle?._id === vehicle._id;

  return (
    <Box
      component="li"
      style={style}
      sx={{
        gap: 2,
        display: 'flex',
        height: ITEM_HEIGHT,
        alignItems: 'center',
      }}
    >
      <ListItemText
        secondaryTypographyProps={{ typography: 'caption' }}
        primary={
          <Stack direction="row" alignItems="center" gap={1} mb={1}>
            <Typography variant="subtitle2" sx={{ mb: 0.25 }}>
              {vehicle.vehicleNo}
            </Typography>
            <Label color={vehicle.isOwn ? 'success' : 'warning'} size="small" variant="soft">
              {vehicle.isOwn ? 'Own' : 'Market'}
            </Label>
          </Stack>
        }
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption">
              {vehicle.vehicleType} • {vehicle.modelType} • {vehicle.vehicleCompany}
            </Typography>
          </Box>
        }
      />

      <Button
        size="small"
        color={isSelected ? 'primary' : 'inherit'}
        onClick={() => onSelect(vehicle)}
        startIcon={
          <Iconify
            width={16}
            icon={isSelected ? 'eva:checkmark-fill' : 'mingcute:add-line'}
            sx={{ mr: -0.5 }}
          />
        }
      >
        {isSelected ? 'Selected' : 'Select'}
      </Button>
    </Box>
  );
};

// Vehicle list component
const VehicleList = ({ vehicles, selectedVehicle, onSelectVehicle }) => (
  <Scrollbar sx={{ height: LIST_HEIGHT }}>
    <Box sx={{ px: 2.5 }}>
      <List
        height={LIST_HEIGHT}
        width="100%"
        itemCount={vehicles.length}
        itemSize={ITEM_HEIGHT}
        itemData={{ vehicles, selectedVehicle, onSelect: onSelectVehicle }}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {VehicleItem}
      </List>
    </Box>
  </Scrollbar>
);

// Quick create form component
const QuickCreateForm = ({ onSubmit, onCancel, isSubmitting, searchQuery, error }) => {
  const methods = useForm({
    resolver: zodResolver(QuickVehicleSchema),
    defaultValues: {
      vehicleNo: searchQuery || '',
      vehicleType: '',
      noOfTyres: 6,
      transporter: '',
    },
  });

  const [transporterDialogOpen, setTransporterDialogOpen] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);

  const handleTransporterSelect = (transporter) => {
    setSelectedTransporter(transporter);
    methods.setValue('transporter', transporter._id);
  };

  return (
    <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="material-symbols:info-outline" sx={{ color: 'primary.main' }} />
            Create a new vehicle with minimal information. You can update the full details later.
          </Box>
        </Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Field.Text name="vehicleNo" label="Vehicle No" required sx={{ mb: 2 }} />
        <Field.Select name="vehicleType" label="Vehicle Type" required sx={{ mb: 2 }}>
          <MenuItem value="">None</MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
          {vehicleTypes.map(({ key, value }) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </Field.Select>
        <Field.Text name="noOfTyres" label="No Of Tyres" type="number" required sx={{ mb: 2 }} />
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setTransporterDialogOpen(true)}
          sx={{
            height: 56,
            justifyContent: 'flex-start',
            typography: 'body2',
          }}
          startIcon={<Iconify icon="mdi:truck-outline" sx={{ color: 'text.disabled' }} />}
        >
          {selectedTransporter ? selectedTransporter.transportName : 'Select Transport Company *'}
        </Button>
      </Box>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>

      <KanbanTransporterDialog
        selectedTransporter={selectedTransporter}
        open={transporterDialogOpen}
        onClose={() => setTransporterDialogOpen(false)}
        onTransporterChange={handleTransporterSelect}
      />
    </Form>
  );
};

// Not found with quick create component
const NotFoundWithQuickCreate = ({
  searchQuery,
  showQuickCreate,
  onShowQuickCreate,
  onQuickCreate,
  isSubmitting,
  error,
}) => (
  <Box sx={{ p: 3 }}>
    {!showQuickCreate ? (
      <>
        <SearchNotFound query={searchQuery} sx={{ mt: 3, mb: 3 }} />
        <Button
          fullWidth
          variant="contained"
          onClick={onShowQuickCreate}
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Create New Vehicle
        </Button>
      </>
    ) : (
      <QuickCreateForm
        onSubmit={onQuickCreate}
        onCancel={() => onShowQuickCreate(false)}
        isSubmitting={isSubmitting}
        searchQuery={searchQuery}
        error={error}
      />
    )}
  </Box>
);

// Filter function
function applyFilter({ inputData, query }) {
  if (query) {
    inputData = inputData.filter((vehicle) => {
      const searchQuery = query.toLowerCase();

      // Helper function to safely check if a field exists and contains the query
      const matchesField = (field) => field && field.toLowerCase().indexOf(searchQuery) !== -1;

      return (
        matchesField(vehicle.vehicleNo) ||
        matchesField(vehicle.vehicleType) ||
        matchesField(vehicle.modelType) ||
        matchesField(vehicle.vehicleCompany)
      );
    });
  }

  return inputData;
}

// ----------------------------------------------------------------------

export function KanbanVehicleDialog({ selectedVehicle = null, open, onClose, onVehicleChange }) {
  const { data: vehicles, refetch } = useVehiclesSummary();
  const createVehicle = useCreateVehicle();
  const [searchVehicle, setSearchVehicle] = useState('');
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSearchVehicle('');
      setShowQuickCreate(false);
      setError(null);
    }
  }, [open]);

  const handleSearchVehicles = useCallback((event) => {
    setSearchVehicle(event.target.value);
    setShowQuickCreate(false);
    setError(null);
  }, []);

  const handleSelectVehicle = useCallback(
    (vehicle) => {
      onVehicleChange(vehicle);
      onClose();
    },
    [onVehicleChange, onClose]
  );

  const handleQuickCreate = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Create a minimal vehicle object with required fields
      const newVehicle = {
        ...data,
        // Add default values for required fields
        isOwn: false,
        modelType: '3118', // Default model type
        vehicleCompany: 'NA', // Default company
        chasisNo: '0000000000000', // Placeholder
        engineNo: '0000000000000', // Placeholder
        manufacturingYear: new Date().getFullYear(),
        loadingCapacity: 35, // Default loading capacity
        engineType: 'bs6', // Default engine type
        fuelTankCapacity: 200, // Default fuel tank capacity
        isActive: true,
      };

      const createdVehicle = await createVehicle(newVehicle);

      // Ensure we have a valid vehicle object before proceeding
      if (createdVehicle && createdVehicle._id) {
        // Refresh the vehicles list
        await refetch();

        // Select the newly created vehicle
        onVehicleChange(createdVehicle);

        // Close the dialog
        onClose();
      } else {
        throw new Error('Failed to create vehicle: Invalid response');
      }
    } catch (err) {
      console.error('Error creating vehicle:', err);
      setError(err.message || 'Failed to create vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dataFiltered = applyFilter({ inputData: vehicles || [], query: searchVehicle });
  const notFound = !dataFiltered.length && !!searchVehicle;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        {showQuickCreate ? 'Create New Vehicle' : 'Vehicles'}
        {!showQuickCreate && <Typography component="span">({vehicles?.length})</Typography>}
      </DialogTitle>

      {!showQuickCreate && <SearchInput value={searchVehicle} onChange={handleSearchVehicles} />}

      <DialogContent sx={{ p: 0 }}>
        {notFound ? (
          <NotFoundWithQuickCreate
            searchQuery={searchVehicle}
            showQuickCreate={showQuickCreate}
            onShowQuickCreate={setShowQuickCreate}
            onQuickCreate={handleQuickCreate}
            isSubmitting={isSubmitting}
            error={error}
          />
        ) : (
          <VehicleList
            vehicles={dataFiltered}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={handleSelectVehicle}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
