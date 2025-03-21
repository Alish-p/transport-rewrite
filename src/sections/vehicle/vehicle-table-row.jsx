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

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function VehicleTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  visibleColumns = {
    vehicleNo: true,
    isOwn: true,
    noOfTyres: true,
    manufacturingYear: true,
    loadingCapacity: true,
    fuelTankCapacity: true,
    transporter: true,
  },
  disabledColumns = {
    vehicleNo: true, // Vehicle number should always be visible
    isOwn: false,
    noOfTyres: false,
    manufacturingYear: false,
    loadingCapacity: false,
    fuelTankCapacity: false,
    transporter: false,
  },
}) {
  const {
    _id,
    vehicleNo,
    vehicleType,
    isOwn,
    noOfTyres,
    manufacturingYear,
    loadingCapacity,
    transporter,
    fuelTankCapacity,
  } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {(visibleColumns.vehicleNo || disabledColumns.vehicleNo) && (
          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={vehicleNo} sx={{ mr: 2 }}>
              {vehicleNo.slice(0, 2).toUpperCase()}
            </Avatar>

            <ListItemText
              disableTypography
              primary={
                <Link
                  noWrap
                  variant="body2"
                  onClick={() => {
                    onViewRow(_id);
                  }}
                  sx={{ color: 'primary', cursor: 'pointer' }}
                >
                  {vehicleNo}
                </Link>
              }
              secondary={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {vehicleType}
                </Typography>
              }
            />
          </TableCell>
        )}

        {(visibleColumns.isOwn || disabledColumns.isOwn) && (
          <TableCell align="center">
            <Label variant="soft" color={isOwn ? 'secondary' : 'warning'}>
              {isOwn ? 'Own' : 'Market'}
            </Label>
          </TableCell>
        )}

        {(visibleColumns.noOfTyres || disabledColumns.noOfTyres) && (
          <TableCell align="center">
            <ListItemText
              primary={noOfTyres}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.manufacturingYear || disabledColumns.manufacturingYear) && (
          <TableCell align="center">
            <ListItemText
              primary={manufacturingYear}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.loadingCapacity || disabledColumns.loadingCapacity) && (
          <TableCell align="center">
            <Label variant="soft" color={loadingCapacity >= 20 ? 'success' : 'error'}>
              {loadingCapacity}
            </Label>
          </TableCell>
        )}

        {(visibleColumns.fuelTankCapacity || disabledColumns.fuelTankCapacity) && (
          <TableCell align="center">
            <ListItemText
              primary={fuelTankCapacity}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.transporter || disabledColumns.transporter) && (
          <TableCell align="center">
            <ListItemText
              primary={transporter?.transportName || '-'}
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
