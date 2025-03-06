/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
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

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function DriverTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  visibleColumns = {
    driverName: true,
    driverCellNo: true,
    permanentAddress: true,
    experience: true,
    licenseTo: true,
    aadharNo: true,
    status: true,
  },
  disabledColumns = {
    driverName: true,
    driverCellNo: false,
    permanentAddress: false,
    experience: false,
    licenseTo: false,
    aadharNo: false,
    status: false,
  },
}) {
  const {
    driverName,
    permanentAddress,
    driverCellNo,
    driverLicenceNo,
    status,
    aadharNo,
    experience,
    licenseTo,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox" align="center">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {(visibleColumns.driverName || disabledColumns.driverName) && (
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar alt={driverName} sx={{ mr: 2 }}>
                {driverName.charAt(0).toUpperCase()}
              </Avatar>

              <ListItemText
                disableTypography
                primary={
                  <Typography variant="body2" noWrap>
                    {driverName}
                  </Typography>
                }
                secondary={
                  <Link
                    noWrap
                    variant="body2"
                    onClick={() => {}}
                    sx={{ color: 'text.disabled', cursor: 'pointer' }}
                  >
                    {driverLicenceNo}
                  </Link>
                }
              />
            </Box>
          </TableCell>
        )}

        {(visibleColumns.driverCellNo || disabledColumns.driverCellNo) && (
          <TableCell align="center">
            <ListItemText
              primary={driverCellNo}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              sx={{ textAlign: 'center' }}
            />
          </TableCell>
        )}

        {(visibleColumns.permanentAddress || disabledColumns.permanentAddress) && (
          <TableCell align="center">
            <ListItemText
              primary={permanentAddress}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              sx={{ textAlign: 'center' }}
            />
          </TableCell>
        )}

        {(visibleColumns.experience || disabledColumns.experience) && (
          <TableCell align="center">
            <ListItemText
              primary={experience}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              sx={{ textAlign: 'center' }}
            />
          </TableCell>
        )}

        {(visibleColumns.licenseTo || disabledColumns.licenseTo) && (
          <TableCell align="center">
            <ListItemText
              primary={fDate(licenseTo)}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              sx={{ textAlign: 'center' }}
            />
          </TableCell>
        )}

        {(visibleColumns.aadharNo || disabledColumns.aadharNo) && (
          <TableCell align="center">
            <ListItemText
              primary={aadharNo}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              sx={{ textAlign: 'center' }}
            />
          </TableCell>
        )}

        {(visibleColumns.status || disabledColumns.status) && (
          <TableCell align="center">
            <Label variant="soft" color={status === 'expired' ? 'error' : 'success'}>
              {status}
            </Label>
          </TableCell>
        )}

        <TableCell align="center" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
        anchorEl={popover.anchorEl}
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
