/* eslint-disable react/prop-types */

// @mui
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Tooltip, MenuList } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { SUBTRIP_STATUS_COLORS } from '../constants';
import { wrapText } from '../../../utils/change-case';
import { fDate, fTime } from '../../../utils/format-time';
import { loadingWeightUnit } from '../../vehicle/vehicle-config';

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
    loadingWeight: true,
  },
  disabledColumns = {
    vehicleNo: true,
    customerId: false,
    routeName: false,
    invoiceNo: false,
    startDate: false,
    subtripStatus: false,
    transport: false,
    loadingWeight: false,
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
    loadingWeight,
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
          <TableCell align="center">
            <Tooltip title={customerId?.customerName}>
              <ListItemText
                primary={customerId?.customerName ? wrapText(customerId?.customerName, 20) : '-'}
                primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              />
            </Tooltip>
          </TableCell>
        )}

        {(visibleColumns.routeName || disabledColumns.routeName) && (
          <TableCell align="center">
            <Tooltip title={routeName}>
              <ListItemText
                primary={routeName ? wrapText(routeName, 20) : '-'}
                primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              />
            </Tooltip>
          </TableCell>
        )}

        {(visibleColumns.invoiceNo || disabledColumns.invoiceNo) && (
          <TableCell align="center">
            <ListItemText
              primary={invoiceNo || '-'}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            />
          </TableCell>
        )}

        {(visibleColumns.startDate || disabledColumns.startDate) && (
          <TableCell align="center">
            <ListItemText
              primary={fDate(startDate)}
              secondary={fTime(startDate)}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
              }}
            />
          </TableCell>
        )}

        {(visibleColumns.loadingWeight || disabledColumns.loadingWeight) && (
          <TableCell align="center">
            <ListItemText
              primary={
                loadingWeight
                  ? `${loadingWeight} ${loadingWeightUnit[vehicleId?.vehicleType]}`
                  : '-'
              }
            />
          </TableCell>
        )}

        {(visibleColumns.transport || disabledColumns.transport) && (
          <TableCell align="center">
            <Tooltip title={vehicleId?.transporter?.transportName}>
              <ListItemText
                primary={
                  vehicleId?.transporter?.transportName
                    ? wrapText(vehicleId?.transporter?.transportName, 20)
                    : '-'
                }
                primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              />
            </Tooltip>
          </TableCell>
        )}

        {(visibleColumns.subtripStatus || disabledColumns.subtripStatus) && (
          <TableCell align="center">
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
