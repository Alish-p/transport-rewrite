/* eslint-disable react/prop-types */

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
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function LoansTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const {
    _id,
    borrowerId,
    borrowerType,
    totalAmount,
    remainingBalance,
    remarks,
    status,
    createdAt,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  // eslint-disable-next-line no-shadow
  const getBorrowerDetails = (borrowerType, borrowerId) => {
    const details = {
      name: '',
      cellNo: '',
    };
    if (borrowerType === 'Driver') {
      details.name = borrowerId.driverName;
      details.cellNo = borrowerId.driverCellNo;
    } else if (borrowerType === 'Transporter') {
      details.name = borrowerId.transportName;
      details.cellNo = borrowerId.cellNo;
    }
    return details;
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {getBorrowerDetails(borrowerType, borrowerId).name}
              </Typography>
            }
            secondary={
              <Link
                noWrap
                variant="body2"
                onClick={() => {}}
                sx={{ color: 'text.disabled', cursor: 'pointer' }}
              >
                {getBorrowerDetails(borrowerType, borrowerId).cellNo}
              </Link>
            }
          />
        </TableCell>
        <TableCell>
          <Label variant="soft" color="info">
            {borrowerType}
          </Label>
        </TableCell>
        <TableCell>
          <ListItemText
            primary={totalAmount}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={fCurrency(remainingBalance) || 0}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={remarks}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          <Label variant="soft" color={remainingBalance > 0 ? 'warning' : 'success'}>
            {remainingBalance > 0 ? 'Pending' : 'Paid'}
          </Label>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(new Date(createdAt))}
            secondary={fTime(new Date(createdAt))}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
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
