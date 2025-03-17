/* eslint-disable react/prop-types */

// @mui
import Link from '@mui/material/Link';
import { MenuList } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { SUBTRIP_STATUS_COLORS } from '../constants';
import { fDate, fTime } from '../../../utils/format-time';

// ----------------------------------------------------------------------

export default function SubtripTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  visibleColumns = {
    vehicleNo: true,
    customerId: true,
    routeName: true,
    invoiceNo: true,
    startDate: true,
    subtripStatus: true,
    transport: true,
  },
  disabledColumns = {
    vehicleNo: true,
    customerId: false,
    routeName: false,
    invoiceNo: false,
    startDate: false,
    subtripStatus: false,
    transport: false,
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
  } = row;

  const popover = usePopover();

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

        {(visibleColumns.transport || disabledColumns.transport) && (
          <TableCell align="center">
            <ListItemText
              primary={vehicleId?.transporter?.transportName || '-'}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

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
        </MenuList>
      </CustomPopover>
    </>
  );
}
