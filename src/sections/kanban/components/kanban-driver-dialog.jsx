import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInView } from 'react-intersection-observer';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';

import { useInfiniteDrivers, useCreateQuickDriver } from 'src/query/use-driver';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingSpinner } from 'src/components/loading-spinner';
import { SearchNotFound } from 'src/components/search-not-found';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

// Quick driver creation schema with only name and cell number
const QuickDriverSchema = zod.object({
  driverName: zod.string().min(1, { message: 'Driver Name is required' }),
  driverCellNo: schemaHelper.phoneNumber({
    message: {
      required_error: 'Driver Cell No is required',
      invalid_error: 'Driver Cell No must be exactly 10 digits',
    },
  }),
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

// Driver list component
const DriverList = ({
  drivers,
  selectedDriver,
  onSelectDriver,
  loadMoreRef,
  isFetchingNextPage,
}) => (
  <Scrollbar sx={{ height: ITEM_HEIGHT * 6, px: 2.5 }}>
    <Box component="ul">
      {drivers.map((driver) => {
        const isSelected = selectedDriver?._id === driver._id;

        return (
          <Box
            component="li"
            key={driver._id}
            sx={{
              gap: 2,
              display: 'flex',
              height: ITEM_HEIGHT,
              alignItems: 'center',
            }}
          >
            <ListItemText
              primaryTypographyProps={{ typography: 'subtitle2', sx: { mb: 0.25 } }}
              secondaryTypographyProps={{ typography: 'caption' }}
              primary={driver.driverName}
              secondary={driver.driverCellNo}
            />

            <Button
              size="small"
              color={isSelected ? 'primary' : 'inherit'}
              onClick={() => onSelectDriver(driver)}
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
      })}
      <Box
        ref={loadMoreRef}
        sx={{
          height: ITEM_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isFetchingNextPage && <LoadingSpinner />}
      </Box>
    </Box>
  </Scrollbar>
);

// Quick create form component
const QuickCreateForm = ({ onSubmit, onCancel, isSubmitting, searchQuery, error }) => {
  const methods = useForm({
    resolver: zodResolver(QuickDriverSchema),
    defaultValues: {
      driverName: searchQuery || '',
      driverCellNo: '',
    },
  });

  return (
    <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="material-symbols:info-outline" sx={{ color: 'primary.main' }} />
            Create a new driver with minimal information. You can update the full details later.
          </Box>
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Field.Text name="driverName" label="Driver Name" required sx={{ mb: 2 }} />
        <Field.Text
          name="driverCellNo"
          label="Driver Cell No"
          required
          InputProps={{
            startAdornment: <InputAdornment position="start">+91 - </InputAdornment>,
          }}
          sx={{ mb: 2 }}
        />
      </Box>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
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
  allowQuickCreate,
}) => (
  <Box sx={{ p: 3 }}>
    {!showQuickCreate ? (
      <>
        <SearchNotFound query={searchQuery} sx={{ mt: 3, mb: 3 }} />
        {allowQuickCreate && (
          <Button
            fullWidth
            variant="contained"
            onClick={onShowQuickCreate}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Create New Driver
          </Button>
        )}
      </>
    ) : (
      allowQuickCreate && (
        <QuickCreateForm
          onSubmit={onQuickCreate}
          onCancel={() => onShowQuickCreate(false)}
          isSubmitting={isSubmitting}
          searchQuery={searchQuery}
          error={error}
        />
      )
    )}
  </Box>
);

// ----------------------------------------------------------------------

export function KanbanDriverDialog({
  selectedDriver = null,
  open,
  onClose,
  onDriverChange,
  allowQuickCreate,
}) {
  const scrollRef = useRef(null);
  const [searchDriver, setSearchDriver] = useState('');
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [error, setError] = useState(null);
  const [newlyCreatedDriver, setNewlyCreatedDriver] = useState(null);
  const {
    mutate: createDriver,
    isLoading: isSubmitting,
    error: mutationError,
  } = useCreateQuickDriver();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteDrivers(
    { search: searchDriver || undefined, rowsPerPage: 50 },
    { enabled: open }
  );
  const drivers = data ? data.pages.flatMap((p) => p.drivers) : [];

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSearchDriver('');
      setShowQuickCreate(false);
      setError(null);
      setNewlyCreatedDriver(null);
    }
  }, [open]);

  const handleSearchDrivers = useCallback((event) => {
    setSearchDriver(event.target.value);
    setShowQuickCreate(false);
    setError(null);
  }, []);

  const handleSelectDriver = useCallback(
    (driver) => {
      onDriverChange(driver);
      onClose();
    },
    [onDriverChange, onClose]
  );

  const handleQuickCreate = async (formData) => {
    try {
      setError(null);

      // Create a minimal driver object with required fields
      const newDriver = {
        ...formData,
        // Add default values for required fields
        driverLicenceNo: 'XX0000000000000', // Placeholder
        driverPresentAddress: 'Temporary Address',
        licenseFrom: new Date(),
        licenseTo: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
        aadharNo: '000000000000',
        experience: 0,
        permanentAddress: 'Temporary Address',
        isActive: true,
        bankDetails: {
          name: 'Temporary Bank',
          branch: 'Temporary Branch',
          ifsc: 'TEMP0000',
          place: 'Temporary Place',
          accNo: '000000000000000000',
        },
      };

      createDriver(newDriver, {
        onSuccess: (createdDriver) => {
          // Store the newly created driver
          setNewlyCreatedDriver(createdDriver);

          // Select the newly created driver
          onDriverChange(createdDriver);

          // Close the dialog
          onClose();
        },
        onError: (err) => {
          console.error('Error creating driver:', err);
          setError(err.message || 'Failed to create driver. Please try again.');
        },
      });
    } catch (err) {
      console.error('Error creating driver:', err);
      setError(err.message || 'Failed to create driver. Please try again.');
    }
  };

  const { ref: loadMoreRef, inView } = useInView({ root: scrollRef.current });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const notFound = !drivers.length && !!searchDriver && !isLoading;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        {showQuickCreate ? 'Create New Driver' : 'Drivers'}
        {!showQuickCreate && (
          <Typography component="span">
            ({data?.pages?.[0]?.totals?.all?.count || 0})
          </Typography>
        )}
      </DialogTitle>

      {!showQuickCreate && <SearchInput value={searchDriver} onChange={handleSearchDrivers} />}

      <DialogContent sx={{ p: 0 }}>
        {isLoading ? (
          <LoadingSpinner sx={{ height: ITEM_HEIGHT * 6 }} />
        ) : notFound ? (
          <NotFoundWithQuickCreate
            searchQuery={searchDriver}
            showQuickCreate={showQuickCreate}
            onShowQuickCreate={setShowQuickCreate}
            onQuickCreate={handleQuickCreate}
            isSubmitting={isSubmitting}
            error={error || (mutationError ? mutationError.message : null)}
            allowQuickCreate={allowQuickCreate}
          />
        ) : (
          <DriverList
            drivers={drivers}
            selectedDriver={selectedDriver}
            onSelectDriver={handleSelectDriver}
            loadMoreRef={loadMoreRef}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
