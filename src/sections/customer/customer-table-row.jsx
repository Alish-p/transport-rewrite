/* eslint-disable react/prop-types */
// @mui
import Link from '@mui/material/Link';
import { MenuList } from '@mui/material';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function CustomerTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  visibleColumns = {
    customerName: true,
    GSTNo: true,
    PANNo: true,
    cellNo: true,
    address: true,
    place: true,
  },
  disabledColumns = {
    customerName: true,
    GSTNo: false,
    PANNo: false,
    cellNo: false,
    address: false,
    place: false,
  },
}) {
  const { customerName, GSTNo, PANNo, cellNo, address, place } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {(visibleColumns.customerName || disabledColumns.customerName) && (
          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={customerName} sx={{ mr: 2 }}>
              {customerName.slice(0, 2).toUpperCase()}
            </Avatar>

            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {customerName}
                </Typography>
              }
              secondary={
                <Link
                  noWrap
                  variant="body2"
                  onClick={() => {}}
                  sx={{ color: 'text.disabled', cursor: 'pointer' }}
                >
                  {place}
                </Link>
              }
            />
          </TableCell>
        )}

        {(visibleColumns.GSTNo || disabledColumns.GSTNo) && (
          <TableCell>
            <ListItemText
              primary={GSTNo}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.PANNo || disabledColumns.PANNo) && (
          <TableCell>
            <ListItemText
              primary={PANNo}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.cellNo || disabledColumns.cellNo) && (
          <TableCell>
            <ListItemText
              primary={cellNo}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.address || disabledColumns.address) && (
          <TableCell>
            <ListItemText
              primary={address}
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
