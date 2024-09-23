import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Link, TableRow, MenuItem, MenuList, TableCell, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';
import { paramCase } from 'src/utils/change-case';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { subtripConfig } from './basic-subtrip-table-config';

// ----------------------------------------------------------------------

export default function SubtripListRow({ row, onDeleteRow, onEditRow }) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);

  const popover = usePopover();
  const navigate = useNavigate();

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleRowClick = () => {
    navigate(paths.dashboardsubtrip.detail(paramCase(row._id)));
  };

  return (
    <>
      <TableRow>
        {subtripConfig.map((column) => (
          <TableCell key={column.id} align={column.align || 'center'}>
            {(() => {
              switch (column.id) {
                case '_id':
                  return (
                    <Link
                      onClick={() => {
                        navigate(paths.dashboardsubtrip.detail(paramCase(row._id)));
                      }}
                    >
                      # {row._id}
                    </Link>
                  );
                case 'customerId':
                  return row?.customerId?.customerName;
                case 'routeName':
                  return row.routeCd.routeName;
                case 'invoiceNo':
                  return row.invoiceNo;
                case 'startDate':
                  return fDate(row[column.id]);
                case 'subtripStatus':
                  return (
                    <Label
                      variant="soft"
                      color={
                        (row[column.id] === 'In-queue' && 'primary') ||
                        (row[column.id] === 'Loaded' && 'secondary') ||
                        (row[column.id] === 'pending' && 'info') ||
                        // (row[column.id] === 'pending' && 'success') ||
                        // (row[column.id] === 'pending' && 'warning') ||
                        'default'
                      }
                    >
                      {row[column.id]}
                    </Label>
                  );

                default:
                  return row[column.id];
              }
            })()}
          </TableCell>
        ))}
        <TableCell align="right">
          <IconButton
            color={openPopover ? 'primary' : 'default'}
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering row click
              handleOpenPopover(e);
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={() => onEditRow(row)}>
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <MenuItem variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </MenuItem>
        }
      />
    </>
  );
}
