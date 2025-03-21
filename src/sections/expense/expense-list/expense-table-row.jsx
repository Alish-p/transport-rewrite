/* eslint-disable react/prop-types */

import { useNavigate } from 'react-router';

// @mui
import Link from '@mui/material/Link';
import { MenuList } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { paths } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function ExpenseTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  visibleColumns = {
    vehicleNo: true,
    date: true,
    expenseType: true,
    amount: true,
    slipNo: true,
    pumpCd: true,
    remarks: true,
    dieselLtr: true,
    paidThrough: true,
    authorisedBy: true,
  },
  disabledColumns = {
    vehicleNo: true, // Vehicle number should always be visible
    date: false,
    expenseType: false,
    amount: false,
    slipNo: false,
    pumpCd: false,
    remarks: false,
    dieselLtr: false,
    paidThrough: false,
    authorisedBy: false,
  },
}) {
  const {
    tripId,
    subtripId,
    vehicleId,
    date,
    expenseType,
    expenseCategory,
    amount,
    slipNo,
    pumpCd,
    remarks,
    dieselLtr,
    paidThrough,
    authorisedBy,
  } = row;

  // if expensecateory is vehicle then vehicleNo is vehicleId.vehicleNo
  // if expensecateory is trip then vehicleNo is tripId.vehicleId.vehicleNo
  const vehicleNo = vehicleId?.vehicleNo;
  // expenseCategory === 'vehicle' ? vehicleId?.vehicleNo : tripId?.vehicleId?.vehicleNo;

  const navigate = useNavigate();

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {(visibleColumns.vehicleNo || disabledColumns.vehicleNo) && (
          <TableCell>
            <ListItemText
              primary={vehicleNo}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.subtripId || disabledColumns.subtripId) && (
          <TableCell>
            <Link
              noWrap
              variant="body2"
              onClick={() => navigate(paths.dashboard.subtrip.details(subtripId))}
              sx={{ color: 'text.success', cursor: 'pointer' }}
            >
              {subtripId?._id || '-'}
            </Link>
          </TableCell>
        )}

        {(visibleColumns.date || disabledColumns.date) && (
          <TableCell>
            <ListItemText
              primary={fDate(new Date(date))}
              secondary={fTime(new Date(date))}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
              }}
            />
          </TableCell>
        )}

        {(visibleColumns.expenseType || disabledColumns.expenseType) && (
          <TableCell>
            <Label variant="soft" color={expenseType >= 20 ? 'success' : 'error'}>
              {expenseType}
            </Label>
          </TableCell>
        )}

        {(visibleColumns.amount || disabledColumns.amount) && (
          <TableCell>
            <ListItemText
              primary={amount}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.slipNo || disabledColumns.slipNo) && (
          <TableCell>
            <ListItemText
              primary={slipNo}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.pumpCd || disabledColumns.pumpCd) && (
          <TableCell>
            <ListItemText
              primary={pumpCd?.pumpName || '-'}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.remarks || disabledColumns.remarks) && (
          <TableCell>
            <ListItemText
              primary={remarks}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.dieselLtr || disabledColumns.dieselLtr) && (
          <TableCell>
            <ListItemText
              primary={dieselLtr || '-'}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.paidThrough || disabledColumns.paidThrough) && (
          <TableCell>
            <ListItemText
              primary={paidThrough}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.authorisedBy || disabledColumns.authorisedBy) && (
          <TableCell>
            <ListItemText
              primary={authorisedBy}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
