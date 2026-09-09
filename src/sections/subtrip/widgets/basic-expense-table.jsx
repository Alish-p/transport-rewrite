import { useState } from 'react';
import { useNavigate } from 'react-router';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Card,
  Chip,
  Table,
  Paper,
  Stack,
  Button,
  Tooltip,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fNumber, fCurrency } from 'src/utils/format-number';

import { useCancelExpense } from 'src/query/use-expense';
import { useCancelTransporterAdvance } from 'src/query/use-transporter-advance';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { TableNoData } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { useSubtripExpenseTypes } from '../../expense/expense-config';

export const BasicExpenseTable = ({ selectedSubtrip, withDelete = true, withAdd = false }) => {
  const cancelExpense = useCancelExpense();
  const cancelAdvance = useCancelTransporterAdvance();
  const navigate = useNavigate();
  const confirm = useBoolean();
  const subtripExpenseTypes = useSubtripExpenseTypes();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Determine if this is a market vehicle subtrip (use advances) or own vehicle (use expenses)
  const isMarketVehicle = selectedSubtrip?.vehicleId?.isOwn === false;
  const items = isMarketVehicle ? selectedSubtrip?.advances || [] : selectedSubtrip?.expenses || [];
  const activeItems = items.filter(item => item.status !== 'Cancelled');
  const totalAmount = activeItems.reduce((acc, item) => acc + (item.amount || 0), 0);

  const label = isMarketVehicle ? 'Advances' : 'Expenses';

  const handleCancel = async (item) => {
    if (!item) return;
    try {
      setIsCancelling(true);
      if (isMarketVehicle) {
        await cancelAdvance(item._id);
      } else {
        await cancelExpense(item._id);
      }
      confirm.onFalse();
    } catch (err) {
      // Handled by query mutation onError
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">Existing {label}</Typography>

        <Stack direction="row" spacing={1}>
          <Chip
            label={`Total: ${fCurrency(totalAmount)}`}
            color="info"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
          {withAdd && (
            <Button
              variant="contained"
              size="small"
              color="primary"
              startIcon={<Iconify icon="mdi:plus" />}
              onClick={() => {
                navigate(`${paths.dashboard.expense.new}?currentSubtrip=${selectedSubtrip._id}`);
              }}
            >
              Add {isMarketVehicle ? 'Advance' : 'Expense'}
            </Button>
          )}
        </Stack>
      </Box>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ maxHeight: 300, overflow: items.length === 0 ? 'hidden' : 'auto' }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center" width="12%">
                Date
              </TableCell>
              <TableCell align="center" width="18%">
                Type
              </TableCell>
              <TableCell align="center" width="12%">
                Diesel Ltr
              </TableCell>
              <TableCell align="center" width="12%">
                Diesel Price
              </TableCell>
              <TableCell align="center" width="15%">
                Amount
              </TableCell>
              <TableCell align="center" width="15%">
                Remarks
              </TableCell>
              <TableCell align="center" width="10%">
                Status
              </TableCell>
              {withDelete && (
                <TableCell align="center" width="6%">
                  Action
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item) => {
              const itemType = item.advanceType || item.expenseType;
              return (
                <TableRow key={item._id} hover sx={item.status === 'Cancelled' ? { opacity: 0.5, textDecoration: 'line-through' } : {}}>
                  <TableCell align="center">{fDate(item.date)}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                      <Iconify
                        icon={
                          subtripExpenseTypes.find((type) => type.label === itemType)?.icon ||
                          'mdi:help-circle'
                        }
                        sx={{ color: 'primary.main' }}
                      />
                      <Typography variant="body2" noWrap>
                        {itemType}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    {item.dieselLtr ? `${fNumber(item.dieselLtr)} L` : '-'}
                  </TableCell>
                  <TableCell align="center">
                    {item.dieselPrice ? `${fNumber(item.dieselPrice)}` : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="medium">
                      {fCurrency(item.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={item.remarks || '-'}>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                        {item.remarks || '-'}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Label
                      variant="soft"
                      color={item.status === 'Cancelled' ? 'error' : 'success'}
                    >
                      {item.status || 'Recorded'}
                    </Label>
                  </TableCell>
                  {withDelete && (
                    <TableCell align="center">
                      {item.status !== 'Cancelled' && (
                        <Tooltip title={`Cancel ${isMarketVehicle ? 'advance' : 'expense'}`}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              confirm.onTrue();
                              setSelectedItem(item);
                            }}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            <TableNoData
              notFound={items.length === 0}
              colSpan={withDelete ? 8 : 7}
              sx={{ py: 2.5 }}
              slotProps={{
                img: { maxWidth: 80 },
                title: { typography: 'subtitle2' },
              }}
            />
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={confirm.value}
        onClose={isCancelling ? undefined : confirm.onFalse}
        title={`Cancel ${isMarketVehicle ? 'Advance' : 'Expense'}`}
        content={`Are you sure you want to cancel this ${isMarketVehicle ? 'advance' : 'expense'}?`}
        cancelText="Close"
        cancelDisabled={isCancelling}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={isCancelling}
            onClick={() => handleCancel(selectedItem)}
          >
            Yes, Cancel
          </LoadingButton>
        }
      />
    </Card>
  );
};
