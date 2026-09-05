import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { useUpdateTaskStatus } from 'src/query/use-task';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { COLUMNS } from '../config';

// ----------------------------------------------------------------------

export function KanbanDetailsToolbar({
  task,
  onDelete,
  onUpdate,
  onCloseDetails,
  isSaving,
  savedAt,
}) {
  const updateTaskStatus = useUpdateTaskStatus();
  const smUp = useResponsive('up', 'sm');

  const confirm = useBoolean();

  const popover = usePopover();

  const [status, setStatus] = useState(task?.status);
  const [liked, setLiked] = useState(Boolean(task?.isLiked || task?.liked));
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (savedAt) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [savedAt]);

  useEffect(() => {
    setStatus(task?.status);
  }, [task?.status]);

  useEffect(() => {
    setLiked(Boolean(task?.isLiked || task?.liked));
  }, [task?.isLiked, task?.liked]);

  const handleChangeStatus = useCallback(
    (newValue) => {
      popover.onClose();
      setStatus(newValue);
      const updatedTask = { ...task, status: newValue };
      updateTaskStatus({ id: task._id, status: newValue });
      onUpdate?.(updatedTask);
    },
    [onUpdate, popover, task, updateTaskStatus]
  );

  const handleToggleLike = useCallback(() => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    onUpdate?.({ ...task, isLiked: nextLiked });
  }, [liked, onUpdate, task]);

  const currentColumn = COLUMNS.find((col) => col.id === status);
  const statusLabel = currentColumn?.name || (status === 'todo' ? 'To-Do' : status);

  const getStatusColor = (colId) => {
    if (colId === 'done') return 'success';
    if (colId === 'in-progress') return 'warning';
    return 'default';
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          p: (theme) => theme.spacing(2.5, 1, 2.5, 2.5),
          borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        {!smUp && (
          <Tooltip title="Back">
            <IconButton onClick={onCloseDetails} sx={{ mr: 1 }}>
              <Iconify icon="eva:arrow-ios-back-fill" />
            </IconButton>
          </Tooltip>
        )}

        <Button
          size="small"
          variant="soft"
          color={getStatusColor(status)}
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={16} sx={{ ml: -0.5 }} />}
          onClick={popover.onOpen}
          sx={{ textTransform: 'none', fontWeight: 'fontWeightSemiBold' }}
        >
          {statusLabel}
        </Button>

        {isSaving ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ ml: 1.5, typography: 'caption', color: 'text.secondary' }}
          >
            <CircularProgress size={12} color="inherit" thickness={5} />
            <span>Saving...</span>
          </Stack>
        ) : showSaved ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ ml: 1.5, typography: 'caption', color: 'success.main' }}
          >
            <Iconify icon="eva:checkmark-fill" width={14} />
            <span>Saved</span>
          </Stack>
        ) : null}

        <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
          <Tooltip title={liked ? 'Unlike' : 'Like'}>
            <IconButton color={liked ? 'primary' : 'default'} onClick={handleToggleLike}>
              <Iconify icon={liked ? 'ic:round-thumb-up' : 'ic:outline-thumb-up'} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete task">
            <IconButton onClick={confirm.onTrue}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>

          <IconButton>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-left' } }}
      >
        <MenuList>
          {COLUMNS.map((option) => (
            <MenuItem
              key={option.id}
              selected={status === option.id}
              onClick={() => {
                handleChangeStatus(option.id);
              }}
            >
              <Label variant="soft" color={getStatusColor(option.id)} sx={{ mr: 1 }}>
                {option.name}
              </Label>
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {task.name} </strong>?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
