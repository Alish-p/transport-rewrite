import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import { usePumps } from 'src/query/use-pump';

import ExpenseCoreForm from '../expense/subtrip-expense-form';

export function AddExpenseDialog({ showDialog, setShowDialog, subtripData }) {
  const { data: pumps, isLoading: pumpLoading } = usePumps(showDialog);

  return (
    <Dialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { p: 1 } }}
    >
      <DialogTitle>Add Expense</DialogTitle>
      <DialogContent>
        <ExpenseCoreForm
          currentSubtrip={subtripData}
          pumps={pumps}
          fromDialog
          onSuccess={() => setShowDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
