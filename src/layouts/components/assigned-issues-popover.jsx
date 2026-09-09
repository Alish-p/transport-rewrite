import dayjs from 'dayjs';
import { m } from 'framer-motion';
import { useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { useMyTasks } from 'src/query/use-task';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const PRIORITY_CONFIG = {
  low: {
    icon: 'solar:double-alt-arrow-down-bold-duotone',
    color: 'info.main',
    label: 'Low',
  },
  medium: {
    icon: 'solar:double-alt-arrow-right-bold-duotone',
    color: 'warning.main',
    label: 'Medium',
  },
  high: {
    icon: 'solar:double-alt-arrow-up-bold-duotone',
    color: 'error.main',
    label: 'High',
  },
};

// ----------------------------------------------------------------------

export function AssignedIssuesPopover({ sx, ...other }) {
  const router = useRouter();
  const popover = usePopover();

  const { data: taskGroups, isLoading } = useMyTasks();

  const todoTasks = useMemo(() => taskGroups?.todo || [], [taskGroups]);
  const inProgressTasks = useMemo(() => taskGroups?.['in-progress'] || [], [taskGroups]);

  const allOpenTasks = useMemo(
    () => [...inProgressTasks, ...todoTasks],
    [inProgressTasks, todoTasks]
  );

  const openCount = allOpenTasks.length;

  const handleTaskClick = useCallback(
    (_taskId) => {
      popover.onClose();
      router.push(paths.dashboard.kanban);
    },
    [popover, router]
  );

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 1.75, px: 2, borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}` }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle2" fontWeight={600}>
          Assigned to me
        </Typography>
        {openCount > 0 ? (
          <Label variant="soft" color="error" sx={{ height: 20, px: 0.75, fontSize: 11 }}>
            {openCount} open
          </Label>
        ) : (
          <Label variant="soft" color="success" sx={{ height: 20, px: 0.75, fontSize: 11 }}>
            All caught up
          </Label>
        )}
      </Stack>

      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
        {openCount} task{openCount !== 1 ? 's' : ''}
      </Typography>
    </Stack>
  );

  const renderTaskItem = (task) => {
    const priority = PRIORITY_CONFIG[task.priority?.toLowerCase()] || PRIORITY_CONFIG.low;
    const isProgress = task.status?.toLowerCase() === 'in-progress';

    const firstDueDate = Array.isArray(task.due) ? task.due[0] : task.due;
    const isOverdue = firstDueDate && dayjs().isAfter(dayjs(firstDueDate), 'day');

    const totalSubtasks = task.subtasks?.length || 0;
    const completedSubtasks = task.subtasks?.filter((st) => st.completed)?.length || 0;

    return (
      <ListItemButton
        key={task._id}
        onClick={() => handleTaskClick(task._id)}
        sx={{
          py: 1.25,
          px: 2,
          gap: 1.25,
          alignItems: 'flex-start',
          borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
          transition: (theme) =>
            theme.transitions.create(['background-color'], {
              duration: theme.transitions.duration.shorter,
            }),
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        {/* Priority Icon from Issue Views */}
        <Tooltip title={`Priority: ${priority.label}`}>
          <Box sx={{ mt: 0.25, flexShrink: 0, display: 'flex' }}>
            <Iconify
              icon={priority.icon}
              width={18}
              height={18}
              sx={{ color: priority.color }}
            />
          </Box>
        </Tooltip>

        {/* Task Details */}
        <ListItemText
          disableTypography
          primary={
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography
                variant="subtitle2"
                noWrap
                sx={{
                  fontWeight: 600,
                  maxWidth: 210,
                  color: 'text.primary',
                  fontSize: 13,
                }}
              >
                {task.name}
              </Typography>

              <Label
                variant="soft"
                color={isProgress ? 'info' : 'warning'}
                sx={{ textTransform: 'capitalize', height: 20, px: 0.75, fontSize: 11, flexShrink: 0 }}
              >
                {isProgress ? 'In Progress' : 'To Do'}
              </Label>
            </Stack>
          }
          secondary={
            <Stack
              direction="row"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
              sx={{ mt: 0.5, typography: 'caption', color: 'text.secondary' }}
            >
              {firstDueDate && (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.25}
                  sx={{
                    color: isOverdue ? 'error.main' : 'text.disabled',
                    fontWeight: isOverdue ? 600 : 400,
                  }}
                >
                  <Iconify icon="solar:calendar-date-bold" width={13} />
                  <span>{isOverdue ? `Overdue • ${fDate(firstDueDate)}` : fDate(firstDueDate)}</span>
                </Stack>
              )}

              {totalSubtasks > 0 && (
                <Stack direction="row" alignItems="center" spacing={0.25} sx={{ color: 'text.disabled' }}>
                  <Iconify icon="solar:checklist-minimalistic-bold" width={13} />
                  <span>
                    {completedSubtasks}/{totalSubtasks}
                  </span>
                </Stack>
              )}

              {task.vehicle?.vehicleNo && (
                <Stack direction="row" alignItems="center" spacing={0.25} sx={{ color: 'text.disabled' }}>
                  <Iconify icon="solar:bus-bold-duotone" width={13} />
                  <span>{task.vehicle.vehicleNo}</span>
                </Stack>
              )}

              {task.driver?.driverName && (
                <Stack direction="row" alignItems="center" spacing={0.25} sx={{ color: 'text.disabled' }}>
                  <Iconify icon="solar:user-rounded-bold-duotone" width={13} />
                  <span>{task.driver.driverName}</span>
                </Stack>
              )}
            </Stack>
          }
        />
      </ListItemButton>
    );
  };

  const renderContent = (
    <Scrollbar sx={{ maxHeight: 360, minHeight: 140 }}>
      {isLoading ? (
        <Stack spacing={1.5} sx={{ p: 2 }}>
          {[1, 2, 3].map((i) => (
            <Stack key={i} direction="row" spacing={1.25} alignItems="center">
              <Skeleton variant="circular" width={20} height={20} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="70%" height={18} />
                <Skeleton variant="text" width="40%" height={14} />
              </Box>
            </Stack>
          ))}
        </Stack>
      ) : allOpenTasks.length === 0 ? (
        <EmptyContent
          title="No open issues"
          description="You have no pending issues assigned to you."
          slotProps={{
            img: { maxWidth: 90 },
            title: { typography: 'subtitle2' },
          }}
          sx={{ py: 3 }}
        />
      ) : (
        <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
          {allOpenTasks.map((task) => renderTaskItem(task))}
        </Box>
      )}
    </Scrollbar>
  );

  return (
    <>
      <Tooltip title="Assigned Issues">
        <IconButton
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.05)}
          onClick={popover.onOpen}
          sx={{
            p: 0,
            width: 40,
            height: 40,
            ...(popover.open && { bgcolor: 'action.selected' }),
            ...sx,
          }}
          {...other}
        >
          <Badge
            badgeContent={openCount}
            color="error"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.75rem',
                minWidth: '18px',
                height: '18px',
                fontWeight: 600,
              },
            }}
          >
            <Iconify icon="solar:clipboard-check-bold-duotone" width={24} />
          </Badge>
        </IconButton>
      </Tooltip>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              p: 0,
              overflow: 'hidden',
              borderRadius: 1.5,
            },
          },
          arrow: { placement: 'right-bottom' },
        }}
      >
        {renderHead}

        {renderContent}
      </CustomPopover>
    </>
  );
}
