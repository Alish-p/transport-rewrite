import { Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { usePumps } from '../../query/use-pump';
import ExpenseCoreForm from '../expense/subtrip-expense-form';

export function AddExpenseDialog({ showDialog, setShowDialog, subtripData }) {
  const { data: pumps, isLoading: pumpLoading } = usePumps(showDialog);

  return (
    <Dialog open={showDialog} onClose={() => setShowDialog(false)} fullWidth maxWidth="sm">
      <DialogTitle>Add Expense</DialogTitle>
      <DialogContent>
        <ExpenseCoreForm
          currentSubtrip={subtripData}
          pumps={pumps}
          fromDialog
          onSuccess={() => setShowDialog(false)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowDialog(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
