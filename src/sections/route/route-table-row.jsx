/* eslint-disable react/prop-types */
// @mui
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

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function RouteTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  visibleColumns = {
    routeName: true,
    fromPlace: true,
    toPlace: true,
    customer: true,
    tollAmt: true,
    noOfDays: true,
    distance: true,
    validFromDate: true,
  },
  disabledColumns = {
    routeName: true,
    fromPlace: false,
    toPlace: false,
    customer: false,
    tollAmt: false,
    noOfDays: false,
    distance: false,
    validFromDate: false,
  },
}) {
  const { routeName, tollAmt, fromPlace, toPlace, noOfDays, distance, validFromDate, customer } =
    row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {(visibleColumns.routeName || disabledColumns.routeName) && (
          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={routeName} sx={{ mr: 2 }}>
              {routeName.slice(0, 2).toUpperCase()}
            </Avatar>

            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {routeName}
                </Typography>
              }
            />
          </TableCell>
        )}

        {(visibleColumns.fromPlace || disabledColumns.fromPlace) && (
          <TableCell align="center">
            <ListItemText
              primary={fromPlace}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.toPlace || disabledColumns.toPlace) && (
          <TableCell align="center">
            <ListItemText
              primary={toPlace}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.customer || disabledColumns.customer) && (
          <TableCell align="center">
            <ListItemText
              primary={customer?.customerName || '-'}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.noOfDays || disabledColumns.noOfDays) && (
          <TableCell align="center">
            <Label variant="soft" color={noOfDays >= 5 ? 'success' : 'error'}>
              {noOfDays}
            </Label>
          </TableCell>
        )}

        {(visibleColumns.distance || disabledColumns.distance) && (
          <TableCell align="center">
            <ListItemText
              primary={distance}
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
