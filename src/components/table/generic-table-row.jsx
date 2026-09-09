import React, { useState } from 'react';

import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function GenericTableRow({
  row,
  columns,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  editDisabled = false,
  editDisabledReason = '',
  onDeleteRow,
  deleteDisabled = false,
  deleteDisabledReason = '',
  deleteTitle = 'Delete',
  deleteContent = 'Are you sure want to delete?',
  deleteActionText = 'Delete',
  deleteCancelText = 'Cancel',
  deleteIcon = 'solar:trash-bin-trash-bold',
  deleteMenuLabel = 'Delete',
  customActions = [],
  visibleColumns = {},
  disabledColumns = {},
  columnOrder = [],
  hideSelection = false,
  rowProps = {},
}) {
  const confirm = useBoolean();
  const popover = usePopover();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDeleteRow) return;
    try {
      setIsDeleting(true);
      await onDeleteRow(row);
      confirm.onFalse();
    } catch (err) {
      // Handled by query mutation onError or caller
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActions = !!(onViewRow || onEditRow || onDeleteRow || customActions.length > 0);

  const orderedColumns =
    columnOrder.length > 0
      ? columnOrder.map((id) => columns.find((column) => column.id === id)).filter(Boolean)
      : columns;

  const renderCellContent = (column) => {
    const value = column.getter(row);
    return (
      <TableCell align={column.align}>
        {column.render ? (
          column.render(row)
        ) : (
          <ListItemText
            primary={value || '-'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        )}
      </TableCell>
    );
  };

  return (
    <>
      <TableRow hover selected={selected} {...rowProps}>
        {!!onSelectRow && (
          <TableCell padding="checkbox">
            {!hideSelection && (
              <Checkbox checked={selected} onClick={onSelectRow} />
            )}
          </TableCell>
        )}

        {orderedColumns.map(
          (column) =>
            (visibleColumns[column.id] || disabledColumns[column.id]) && (
              <React.Fragment key={column.id}>{renderCellContent(column)}</React.Fragment>
            )
        )}

        {hasActions && (
          <TableCell align="right" sx={{ px: 1 }}>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        )}
      </TableRow>

      {hasActions && (
        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          anchorEl={popover.anchorEl}
          slotProps={{ arrow: { placement: 'right-top' } }}
        >
          <MenuList>
            {onViewRow && (
              <MenuItem
                onClick={() => {
                  onViewRow(row);
                  popover.onClose();
                }}
              >
                <Iconify icon="solar:eye-bold" />
                View
              </MenuItem>
            )}

            {onEditRow && (
              <Tooltip
                title={editDisabled ? editDisabledReason : ''}
                placement="left"
                disableHoverListener={!editDisabled}
              >
                <span>
                  <MenuItem
                    disabled={editDisabled}
                    onClick={() => {
                      if (!editDisabled) {
                        onEditRow(row);
                        popover.onClose();
                      }
                    }}
                  >
                    <Iconify icon="solar:pen-bold" />
                    Edit
                  </MenuItem>
                </span>
              </Tooltip>
            )}

            {customActions.length > 0 && <Divider sx={{ borderStyle: 'dashed' }} />}

            {customActions.map((action, index) => (
              <MenuItem
                key={action.label || index}
                onClick={() => {
                  action.onClick(row);
                  popover.onClose();
                }}
                sx={{ color: action.color || 'inherit' }}
              >
                {action.icon && <Iconify icon={action.icon} />}
                {action.label}
              </MenuItem>
            ))}

            {onDeleteRow && <Divider sx={{ borderStyle: 'dashed' }} />}

            {onDeleteRow && (
              <Tooltip
                title={deleteDisabled ? deleteDisabledReason : ''}
                placement="left"
                disableHoverListener={!deleteDisabled}
              >
                <span>
                  <MenuItem
                    disabled={deleteDisabled || isDeleting}
                    onClick={() => {
                      if (!deleteDisabled && !isDeleting) {
                        confirm.onTrue();
                        popover.onClose();
                      }
                    }}
                    sx={{ color: deleteDisabled ? 'text.disabled' : 'error.main' }}
                  >
                    <Iconify icon={deleteIcon} />
                    {deleteMenuLabel}
                  </MenuItem>
                </span>
              </Tooltip>
            )}
          </MenuList>
        </CustomPopover>
      )}

      {onDeleteRow && hasActions && (
        <ConfirmDialog
          open={confirm.value}
          onClose={isDeleting ? undefined : confirm.onFalse}
          title={deleteTitle}
          content={deleteContent}
          cancelText={deleteCancelText}
          cancelDisabled={isDeleting}
          action={
            <LoadingButton
              variant="contained"
              color="error"
              loading={isDeleting}
              onClick={handleDelete}
            >
              {deleteActionText}
            </LoadingButton>
          }
        />
      )}
    </>
  );
}
