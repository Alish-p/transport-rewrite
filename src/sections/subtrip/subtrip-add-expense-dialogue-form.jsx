import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { fetchPumps } from '../../redux/slices/pump';
import ExpenseCoreForm from '../expense/expense-core-form';

export function AddExpenseDialog({ showDialog, setShowDialog, subtripData }) {
  const { pumps } = useSelector((state) => state.pump);
  const dispatch = useDispatch();

  useEffect(() => {
    if (showDialog) {
      dispatch(fetchPumps());
    }
  }, [dispatch, showDialog]);

  // Alert Content Mapping

  return (
    <Dialog open={showDialog} onClose={() => setShowDialog(false)} fullWidth maxWidth="sm">
      <DialogTitle>Add Expense</DialogTitle>
      <DialogContent>
        <ExpenseCoreForm currentSubtrip={subtripData} pumps={pumps} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowDialog(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
