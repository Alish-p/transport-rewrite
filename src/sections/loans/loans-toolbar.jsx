// LoansToolbar.jsx
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Stack,
  Radio,
  Button,
  Dialog,
  Tooltip,
  TextField,
  FormLabel,
  IconButton,
  RadioGroup,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';

import { useRepayLoan, useDeferNextInstallment, useDeferAllInstallments } from 'src/query/use-loan';

import { Iconify } from 'src/components/iconify';

import LoansPDF from './loans-pdf';

export default function LoansToolbar({ loan, onActionSuccess }) {
  const view = useBoolean();

  // Repay
  const repay = useRepayLoan();
  const [openRepay, setOpenRepay] = useState(false);
  const [repayType, setRepayType] = useState('full');
  const [repayForm, setRepayForm] = useState({
    amount: loan.emi.amount,
    paidDate: dayjs(),
    remarks: '',
  });

  // Defer Next
  const deferNext = useDeferNextInstallment();
  const [openNext, setOpenNext] = useState(false);
  const [deferredTo, setDeferredTo] = useState(dayjs());

  // Defer All
  const deferAll = useDeferAllInstallments();
  const [openAll, setOpenAll] = useState(false);
  const [days, setDays] = useState(1);

  // Handlers factory
  const handleField = (setter) => (e) => setter(e.target.value);

  // === Repay handlers ===
  const startRepay = () => {
    setRepayType('full');
    setRepayForm({ amount: loan.emi.amount, paidDate: dayjs(), remarks: '' });
    setOpenRepay(true);
  };
  const submitRepay = async () => {
    await repay({
      id: loan._id,
      amount: parseFloat(repayForm.amount),
      paidDate: repayForm.paidDate.toISOString(),
      remarks: repayForm.remarks,
    });
    setOpenRepay(false);
    onActionSuccess?.();
  };

  // === Defer Next handlers ===
  const startDeferNext = () => {
    setDeferredTo(dayjs());
    setOpenNext(true);
  };
  const submitDeferNext = async () => {
    await deferNext({ id: loan._id, deferredTo: deferredTo.toISOString() });
    setOpenNext(false);
    onActionSuccess?.();
  };

  // === Defer All handlers ===
  const startDeferAll = () => {
    setDays(1);
    setOpenAll(true);
  };
  const submitDeferAll = async () => {
    await deferAll({ id: loan._id, days: Number(days) });
    setOpenAll(false);
    onActionSuccess?.();
  };

  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Stack direction="row" spacing={1} flexGrow={1}>
          <Tooltip title="View PDF">
            <IconButton onClick={view.onTrue}>
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>

          <PDFDownloadLink
            document={<LoansPDF loan={loan} />}
            fileName={loan._id}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Tooltip title="Download PDF">
                <IconButton>
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Iconify icon="eva:cloud-download-fill" />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </PDFDownloadLink>

          <Tooltip title="Repay Loan">
            <IconButton color="primary" onClick={startRepay}>
              <Iconify icon="solar:hand-money-linear" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Defer Next EMI">
            <IconButton color="warning" onClick={startDeferNext}>
              <Iconify icon="eva:clock-outline" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Defer All EMIs">
            <IconButton color="error" onClick={startDeferAll}>
              <Iconify icon="material-symbols:more-time-rounded" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* PDF Viewer */}
      <Dialog fullScreen open={view.value}>
        <DialogActions sx={{ p: 1 }}>
          <Button variant="contained" onClick={view.onFalse}>
            Close
          </Button>
        </DialogActions>
        <PDFViewer style={{ flex: 1, border: 'none' }}>
          <LoansPDF loan={loan} />
        </PDFViewer>
      </Dialog>

      {/* Repay Dialog */}
      <Dialog open={openRepay} onClose={() => setOpenRepay(false)} fullWidth maxWidth="xs">
        <DialogTitle>Repay Loan</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Amount</FormLabel>
            <RadioGroup
              row
              value={repayType}
              onChange={(e) => {
                const t = e.target.value;
                setRepayType(t);
                setRepayForm((f) => ({
                  ...f,
                  amount: t === 'full' ? loan.emi.amount : f.amount,
                }));
              }}
            >
              <FormControlLabel
                value="full"
                control={<Radio />}
                label={`Full EMI (${fCurrency(loan.emi.amount)})`}
              />
              <FormControlLabel value="custom" control={<Radio />} label="Custom" />
            </RadioGroup>
          </FormControl>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={repayForm.amount}
            onChange={handleField((v) => setRepayForm((f) => ({ ...f, amount: v })))}
            disabled={repayType === 'full'}
            sx={{ mb: 2 }}
          />
          <DatePicker
            label="Paid Date"
            value={repayForm.paidDate}
            onChange={(d) => setRepayForm((f) => ({ ...f, paidDate: d }))}
            slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
          />
          <TextField
            label="Remarks"
            multiline
            rows={2}
            fullWidth
            value={repayForm.remarks}
            onChange={handleField((v) => setRepayForm((f) => ({ ...f, remarks: v })))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRepay(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitRepay}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Defer Next Dialog */}
      <Dialog open={openNext} onClose={() => setOpenNext(false)} fullWidth maxWidth="xs">
        <DialogTitle>Defer Next EMI</DialogTitle>
        <DialogContent dividers sx={{ padding: '1rem' }}>
          <DatePicker
            label="New Due Date"
            value={deferredTo}
            onChange={setDeferredTo}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNext(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitDeferNext}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Defer All Dialog */}
      <Dialog open={openAll} onClose={() => setOpenAll(false)} fullWidth maxWidth="xs">
        <DialogTitle>Defer All EMIs</DialogTitle>
        <DialogContent dividers sx={{ padding: '1rem' }}>
          <TextField
            label="Days to Defer"
            type="number"
            fullWidth
            value={days}
            onChange={handleField(setDays)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAll(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitDeferAll}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
