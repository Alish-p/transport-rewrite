import { z as zod } from 'zod';
// form
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useMemo, useState, useEffect } from 'react';

// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Alert,
  Divider,
  MenuItem,
  Typography,
  InputAdornment,
} from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';

import { useCreateLoan, useUpdateLoan } from 'src/query/use-loan';

// components
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { KanbanDriverDialog } from 'src/sections/kanban/components/kanban-driver-dialog';
import { KanbanTransporterDialog } from 'src/sections/kanban/components/kanban-transporter-dialog';

import { BORROWER_TYPES } from './loans-config';

// ----------------------------------------------------------------------

export const LoansSchema = zod.object({
  borrowerId: zod.string().min(1),
  borrowerType: zod.string().min(1),
  principalAmount: zod.number().min(1, { message: 'Amount is required' }),
  interestRate: zod
    .number()
    .min(0)
    .max(100, { message: 'Interest Rate must be between 0 and 100' }),
  remarks: zod.string().optional(),
  disbursementDate: schemaHelper
    .date({ message: { required_error: 'Issued date is required!' } })
    .optional(),
  tenureMonths: zod.number().min(1).optional(),
});

// ----------------------------------------------------------------------

export default function LoanForm({ currentLoan }) {
  const navigate = useNavigate();
  const updateLoan = useUpdateLoan();
  const createLoan = useCreateLoan();

  const defaultValues = useMemo(
    () => ({
      borrowerType: currentLoan?.borrowerType || '',
      borrowerId: currentLoan?.borrowerId?._id || '',
      type: currentLoan?.type || 'advance',
      principalAmount: currentLoan?.principalAmount || 0,
      interestRate: currentLoan?.interestRate || 0,
      remarks: currentLoan?.remarks || '',
      disbursementDate: currentLoan?.disbursementDate || new Date(),
      repaymentType: currentLoan?.repaymentType || 'full',
      tenureMonths: currentLoan?.tenureMonths || 1,
    }),
    [currentLoan]
  );

  const methods = useForm({
    resolver: zodResolver(LoansSchema),
    defaultValues,
    mode: 'all',
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const { borrowerType, interestRate, principalAmount, tenureMonths } = watch();

  // Dialog controls
  const driverDialog = useBoolean(false);
  const transporterDialog = useBoolean(false);

  // Local selection state for label display and dialog preselection
  const [selectedDriver, setSelectedDriver] = useState(
    currentLoan?.borrowerType === 'Driver' ? currentLoan?.borrowerId || null : null
  );
  const [selectedTransporter, setSelectedTransporter] = useState(
    currentLoan?.borrowerType === 'Transporter' ? currentLoan?.borrowerId || null : null
  );

  // Clear borrower when borrowerType changes (skip first render)
  const firstTypeRun = useRef(true);
  useEffect(() => {
    if (firstTypeRun.current) {
      firstTypeRun.current = false;
      return;
    }
    setValue('borrowerId', '');
    if (borrowerType === 'Driver') {
      setSelectedTransporter(null);
    } else if (borrowerType === 'Transporter') {
      setSelectedDriver(null);
    } else {
      setSelectedDriver(null);
      setSelectedTransporter(null);
    }
  }, [borrowerType, setValue]);

  const handleDriverChange = (driver) => {
    setSelectedDriver(driver);
    setValue('borrowerId', driver._id, { shouldValidate: true });
  };

  const handleTransporterChange = (transporter) => {
    setSelectedTransporter(transporter);
    setValue('borrowerId', transporter._id, { shouldValidate: true });
  };

  // Handle form submission (create or update)
  const onSubmit = async (data) => {
    try {
      const loansData = {
        ...data,
      };
      if (currentLoan) {
        await updateLoan({ id: currentLoan._id, data: loansData });
        navigate(paths.dashboard.loan.details(currentLoan._id));
      } else {
        const newLoan = await createLoan(loansData);
        navigate(paths.dashboard.loan.details(newLoan._id));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while processing the loan.');
    }
  };

  const renderLoanDetails = () => (
    <>
      <Typography variant="h6" sx={{ p: 3, mt: 1 }}>
        Loan&apos;s Details
      </Typography>
      <Card sx={{ p: 3, mb: 3 }}>
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
          gap={3}
        >
          <Field.Select name="borrowerType" label="Borrower Type">
            <MenuItem value="">None</MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {BORROWER_TYPES.map(({ key, label }) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Field.Select>

          <Box>
            <DialogSelectButton
              onClick={
                borrowerType === 'Driver'
                  ? driverDialog.onTrue
                  : borrowerType === 'Transporter'
                    ? transporterDialog.onTrue
                    : () => {}
              }
              disabled={!borrowerType}
              placeholder={
                !borrowerType
                  ? 'Select Borrower Type first'
                  : borrowerType === 'Driver'
                    ? 'Select Driver'
                    : 'Select Transporter'
              }
              selected={
                borrowerType === 'Driver'
                  ? selectedDriver?.driverName
                  : borrowerType === 'Transporter'
                    ? selectedTransporter?.transportName
                    : undefined
              }
              error={!!errors.borrowerId?.message}
              iconName={borrowerType === 'Transporter' ? 'mdi:truck-delivery' : 'mdi:account'}
            />
          </Box>

          <Field.Text
            name="principalAmount"
            label="Principal Amount"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">₹</InputAdornment>,
            }}
          />

          <Field.Text
            name="interestRate"
            label="Interest Rate"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">Yearly %</InputAdornment>,
            }}
          />
          <Field.Text name="remarks" label="Remarks" />

          <Field.DatePicker name="disbursementDate" label="Issue Date" />

          <Field.Text
            name="tenureMonths"
            label="tenureMonths"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">Months</InputAdornment>,
            }}
          />
        </Box>
      </Card>
    </>
  );

  const renderActions = () => (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {currentLoan ? 'Update Loan' : 'Create Loan'}
      </LoadingButton>
    </Stack>
  );

  const renderAlerts = () => {
    const monthlyRate = interestRate / 100 / 12;
    const emiAmount =
      interestRate === 0
        ? principalAmount / tenureMonths
        : (principalAmount * monthlyRate) / (1 - (1 + monthlyRate) ** -tenureMonths);
    const totalAmount = emiAmount * tenureMonths;

    return (
      <>
        {watch('tenureMonths') > 0 && watch('principalAmount') > 0 && (
          <>
            <Alert severity="success" variant="outlined" sx={{ my: 2 }}>
              {`The total loan amount is ${fCurrency(principalAmount)}. It will be repaid over ${tenureMonths} months with an EMI of ${fCurrency(emiAmount)} each month.`}
            </Alert>
            <Alert severity="info" variant="outlined" sx={{ my: 2 }}>
              {`The interest amount is ${fCurrency(totalAmount - principalAmount)}. The total amount to be repaid is ${fCurrency(totalAmount)}.`}
            </Alert>
          </>
        )}
      </>
    );
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderLoanDetails()}
        </Grid>
      </Grid>

      {renderAlerts()}
      <Divider sx={{ my: 3 }} />
      {renderActions()}

      {/* Selection dialogs */}
      <KanbanDriverDialog
        open={driverDialog.value}
        onClose={driverDialog.onFalse}
        selectedDriver={selectedDriver}
        onDriverChange={handleDriverChange}
        allowQuickCreate
      />

      <KanbanTransporterDialog
        open={transporterDialog.value}
        onClose={transporterDialog.onFalse}
        selectedTransporter={selectedTransporter}
        onTransporterChange={handleTransporterChange}
      />
    </Form>
  );
}
