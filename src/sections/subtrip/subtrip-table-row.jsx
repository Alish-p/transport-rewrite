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

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { SUBTRIP_STATUS_COLORS } from './constants';
import { fDate, fTime, getEwayBillStatus } from '../../utils/format-time';

// ----------------------------------------------------------------------

export default function SubtripTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  visibleColumns = {
    vehicleNo: true,
    customerName: true,
    routeName: true,
    invoiceNo: true,
    startDate: true,
    ewayBillExpiry: true,
    subtripStatus: true,
  },
  disabledColumns = {
    vehicleNo: true, // Vehicle number should always be visible
    customerName: false,
    routeName: false,
    invoiceNo: false,
    startDate: false,
    ewayBillExpiry: false,
    subtripStatus: false,
  },
}) {
  const {
    _id,
    customerId,
    routeCd: { routeName } = {},
    invoiceNo,
    subtripStatus,
    startDate,
    tripId: { vehicleId },
    ewayExpiryDate,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const ewayBillStatus = getEwayBillStatus(ewayExpiryDate);

  console.log({ ewayBillStatus });

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        {(visibleColumns.vehicleNo || disabledColumns.vehicleNo) && (
          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={vehicleId?.vehicleNo} sx={{ mr: 2 }}>
              {vehicleId?.vehicleNo.slice(0, 2).toUpperCase()}
            </Avatar>

            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {vehicleId?.vehicleNo}
                </Typography>
              }
              secondary={
                <Link
                  noWrap
                  variant="body2"
                  onClick={() => {
                    onViewRow(_id);
                  }}
                  sx={{ color: 'primary', cursor: 'pointer' }}
                >
                  {_id}
                </Link>
              }
            />
          </TableCell>
        )}
        {(visibleColumns.customerId || disabledColumns.customerId) && (
          <TableCell>
            <ListItemText
              primary={customerId?.customerName}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}
        {(visibleColumns.routeName || disabledColumns.routeName) && (
          <TableCell>
            <ListItemText
              primary={routeName}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}
        {(visibleColumns.invoiceNo || disabledColumns.invoiceNo) && (
          <TableCell>
            <ListItemText
              primary={invoiceNo || '-'}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}
        {(visibleColumns.startDate || disabledColumns.startDate) && (
          <TableCell>
            <ListItemText
              primary={fDate(new Date(startDate))}
              secondary={fTime(new Date(startDate))}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
              }}
            />
          </TableCell>
        )}
        <TableCell>
          {ewayExpiryDate ? (
            <>
              <Label variant="soft" color={ewayBillStatus.color}>
                {ewayBillStatus.days > 0 && `${ewayBillStatus.days}d `}
                {ewayBillStatus.hours}h remaining
              </Label>
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 0.5, color: 'text.secondary' }}
              >
                Expires: {fDate(ewayExpiryDate)}
              </Typography>
            </>
          ) : (
            <Label variant="soft" color="error">
              No E-way Bill
            </Label>
          )}
        </TableCell>
        {(visibleColumns.subtripStatus || disabledColumns.subtripStatus) && (
          <TableCell>
            <Label variant="soft" color={SUBTRIP_STATUS_COLORS[subtripStatus] || 'default'}>
              {subtripStatus}
            </Label>
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
