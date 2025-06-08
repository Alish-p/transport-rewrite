// @mui
import { useNavigate } from 'react-router';

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
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { paths } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function PumpTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  visibleColumns = {
    pumpName: true,
    placeName: true,
    ownerName: true,
    ownerCellNo: true,
    pumpPhoneNo: true,
    taluk: true,
    district: true,
    address: true,
  },
  disabledColumns = {
    pumpName: true,
    placeName: false,
    ownerName: false,
    ownerCellNo: false,
    pumpPhoneNo: false,
    taluk: false,
    district: false,
    address: false,
  },
}) {
  const { _id, pumpName, placeName, ownerName, ownerCellNo, pumpPhoneNo, taluk, district, address } =
    row;

  const confirm = useBoolean();

  const popover = usePopover();
  const navigate = useNavigate()

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {(visibleColumns.pumpName || disabledColumns.pumpName) && (
          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={pumpName} sx={{ mr: 2 }}>
              {pumpName.slice(0, 1).toUpperCase()}
            </Avatar>

            <ListItemText
              disableTypography
              primary={
                <Link
                  noWrap
                  variant="body2"
                  onClick={() => {
                    navigate(paths.dashboard.pump.details(_id))
                  }}
                  sx={{ color: 'success', cursor: 'pointer' }}
                >
                  {pumpName}
                </Link>
              }
            />
          </TableCell>
        )}

        {(visibleColumns.placeName || disabledColumns.placeName) && (
          <TableCell>
            <ListItemText
              primary={placeName}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.ownerName || disabledColumns.ownerName) && (
          <TableCell>
            <ListItemText
              primary={ownerName}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.ownerCellNo || disabledColumns.ownerCellNo) && (
          <TableCell>
            <ListItemText
              primary={ownerCellNo}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.pumpPhoneNo || disabledColumns.pumpPhoneNo) && (
          <TableCell>
            <ListItemText
              primary={pumpPhoneNo}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.taluk || disabledColumns.taluk) && (
          <TableCell>
            <ListItemText
              primary={taluk}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.district || disabledColumns.district) && (
          <TableCell>
            <ListItemText
              primary={district}
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
