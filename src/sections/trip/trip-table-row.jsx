/* eslint-disable react/prop-types */

import { useNavigate } from 'react-router';

// @mui
import Link from '@mui/material/Link';
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
import { Box, Paper, Stack, Collapse, MenuList } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

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
    driverName: true,
    tripStatus: true,
    fromDate: true,
    toDate: true,
    remarks: true,
  },
  disabledColumns = {
    vehicleNo: true, // Vehicle number should always be visible
    driverName: false,
    tripStatus: false,
    fromDate: false,
    toDate: false,
    remarks: false,
  },
}) {
  const {
    _id,
    vehicleId: { vehicleNo },
    driverId,
    tripStatus,
    fromDate,
    remarks,
    toDate,
    subtrips,
  } = row;

  const confirm = useBoolean();
  const collapse = useBoolean();
  const popover = usePopover();
  const navigate = useNavigate();

  const renderPrimary = (
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
              <Typography variant="body2" noWrap>
                {vehicleNo}
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

      {(visibleColumns.driverName || disabledColumns.driverName) && (
        <TableCell>
          <ListItemText
            primary={driverId?.driverName}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>
      )}

      {(visibleColumns.tripStatus || disabledColumns.tripStatus) && (
        <TableCell>
          <Label variant="soft" color={tripStatus.toLowerCase() === 'open' ? 'warning' : 'success'}>
            {tripStatus}
          </Label>
        </TableCell>
      )}

      {(visibleColumns.fromDate || disabledColumns.fromDate) && (
        <TableCell>
          <ListItemText
            primary={fDate(new Date(fromDate))}
            secondary={fTime(new Date(fromDate))}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
      )}

      {(visibleColumns.toDate || disabledColumns.toDate) && (
        <TableCell>
          <ListItemText
            primary={toDate ? fDate(new Date(toDate)) : '--'}
            secondary={toDate ? fTime(new Date(toDate)) : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
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

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {subtrips.map((subtrip) => (
              <Stack
                key={subtrip._id}
                direction="row"
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                  },
                }}
              >
                <Avatar alt={subtrip._id} sx={{ mr: 2 }}>
                  {subtrip?.customerId?.customerName?.slice(0, 2).toUpperCase()}
                </Avatar>

                <ListItemText
                  disableTypography
                  primary={
                    <Typography variant="body2" noWrap>
                      {subtrip?.customerId?.customerName}
                    </Typography>
                  }
                  secondary={
                    <Link
                      noWrap
                      variant="body2"
                      onClick={() => {
                        navigate(paths.dashboard.subtrip.details(subtrip._id));
                      }}
                      sx={{ color: 'primary', cursor: 'pointer' }}
                    >
                      {subtrip._id}
                    </Link>
                  }
                />

                <Box sx={{ width: 200, textAlign: 'center' }}>
                  {`${subtrip.loadingPoint} - ${subtrip.unloadingPoint}`}
                </Box>

                <Box sx={{ width: 200, textAlign: 'center' }}>
                  {subtrip.quantity &&
                    subtrip.materialType &&
                    `${subtrip.quantity} x ${subtrip.materialType}`}
                </Box>
                <Box sx={{ width: 200, textAlign: 'right' }}>
                  <Link
                    noWrap
                    variant="body2"
                    onClick={() => {
                      navigate(paths.dashboard.subtrip.details(subtrip._id));
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Iconify icon="solar:eye-bold" />
                  </Link>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );
  return (
    <>
      {renderPrimary}

      {renderSecondary}

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
