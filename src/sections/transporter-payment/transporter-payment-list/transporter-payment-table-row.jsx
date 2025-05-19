/* eslint-disable react/prop-types */

import { useNavigate } from 'react-router';

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

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime, fDateRangeShortLabel } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function TransporterPaymentTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const { _id, paymentId, transporterId, issueDate, billingPeriod, status, summary } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const navigate = useNavigate();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell>
          <Label variant="soft">
            <Link
              noWrap
              variant="body2"
              onClick={() => {
                navigate(paths.dashboard.transporterPayment.details(_id));
              }}
              sx={{ color: 'text.disabled', cursor: 'pointer' }}
            >
              {paymentId}
            </Link>
          </Label>
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {transporterId?.transportName}
              </Typography>
            }
            secondary={
              <Link
                noWrap
                variant="body2"
                onClick={() => {}}
                sx={{ color: 'text.disabled', cursor: 'pointer' }}
              >
                {transporterId?.cellNo}
              </Link>
            }
          />
        </TableCell>
        <TableCell>
          <Label variant="soft" color={status === 'paid' ? 'success' : 'error'}>
            {status}
          </Label>
        </TableCell>
        <TableCell>
          <ListItemText
            primary={fDate(new Date(issueDate))}
            secondary={fTime(new Date(issueDate))}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={summary?.netIncome}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDateRangeShortLabel(billingPeriod?.start, billingPeriod?.end)}
            primaryTypographyProps={{
              color: 'text.disabled',
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
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
              onDeleteRow();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
