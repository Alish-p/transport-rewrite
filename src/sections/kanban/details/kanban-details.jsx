import dayjs from 'dayjs';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import { useTabs } from 'src/hooks/use-tabs';
import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { useAddSubtask, useToggleSubtask, useDeleteSubtask } from 'src/query/use-task';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { DEPARTMENTS } from '../config';
import { KanbanDetailsToolbar } from './kanban-details-toolbar';
import { KanbanInputName } from '../components/kanban-input-name';
import { KanbanDetailsPriority } from './kanban-details-priority';
import { KanbanDetailsAttachments } from './kanban-details-attachments';
import { KanbanDriverDialog } from '../components/kanban-driver-dialog';
import { KanbanDetailsCommentList } from './kanban-details-comment-list';
import { KanbanVehicleDialog } from '../components/kanban-vehicle-dialog';
import { KanbanDetailsCommentInput } from './kanban-details-comment-input';
import { KanbanContactsDialog } from '../components/kanban-contacts-dialog';

// ----------------------------------------------------------------------

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  width: 100,
  flexShrink: 0,
  color: theme.vars.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}));

// ----------------------------------------------------------------------

export function KanbanDetails({ task, openDetails, onUpdateTask, onDeleteTask, onCloseDetails }) {
  const tabs = useTabs('overview');

  const [priority, setPriority] = useState(task.priority);

  const [taskName, setTaskName] = useState(task.name);

  const contacts = useBoolean();

  const [taskDescription, setTaskDescription] = useState(task.description);

  const getInitialDueDate = useCallback((due) => {
    if (!due) return null;
    const raw = Array.isArray(due) ? due[0] : due;
    return raw && dayjs(raw).isValid() ? dayjs(raw) : null;
  }, []);

  const [dueDate, setDueDate] = useState(() => getInitialDueDate(task?.due));
  const datePopover = usePopover();

  const [selectedDepartments, setSelectedDepartments] = useState(task?.departments || []);

  const [location, setLocation] = useState(task?.location || '');

  const [selectedAssignees, setSelectedAssignees] = useState(task?.assignees || []);

  const [selectedDriver, setSelectedDriver] = useState(task?.driver || null);
  const driverDialog = useBoolean();

  const [selectedVehicle, setSelectedVehicle] = useState(task?.vehicle || null);
  const vehicleDialog = useBoolean();

  const [newSubtask, setNewSubtask] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const addSubtask = useAddSubtask();
  const toggleSubtask = useToggleSubtask();
  const deleteSubtask = useDeleteSubtask();

  useEffect(() => {
    setTaskName(task.name);
    setTaskDescription(task.description);
    setPriority(task.priority);
    setSelectedDepartments(task?.departments || []);
    setLocation(task?.location || '');
    setSelectedAssignees(task?.assignees || []);
    setSelectedDriver(task?.driver || null);
    setSelectedVehicle(task?.vehicle || null);
    setDueDate(getInitialDueDate(task?.due));
  }, [getInitialDueDate, task]);

  const saveTask = useCallback(
    async (partialChanges = {}) => {
      const payload = {
        ...task,
        name: taskName,
        description: taskDescription,
        priority,
        departments: selectedDepartments,
        due: dueDate ? [dueDate.toISOString()] : [],
        location,
        assignees: selectedAssignees,
        driver: selectedDriver,
        vehicle: selectedVehicle,
        ...partialChanges,
      };

      setIsSaving(true);
      try {
        await onUpdateTask(payload, { quiet: true });
        setSavedAt(Date.now());
      } catch (error) {
        console.error('Failed to auto-save task:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [
      dueDate,
      location,
      onUpdateTask,
      priority,
      selectedAssignees,
      selectedDepartments,
      selectedDriver,
      selectedVehicle,
      task,
      taskDescription,
      taskName,
    ]
  );

  const handleChangeDueDate = useCallback(
    (newValue) => {
      setDueDate(newValue);
      saveTask({ due: newValue ? [newValue.toISOString()] : [] });
    },
    [saveTask]
  );

  const handleClearDueDate = useCallback(() => {
    setDueDate(null);
    datePopover.onClose();
    saveTask({ due: [] });
  }, [datePopover, saveTask]);

  const handleChangeTaskName = useCallback((event) => {
    setTaskName(event.target.value);
  }, []);

  const handleBlurTaskName = useCallback(() => {
    if (taskName.trim() && taskName !== task.name) {
      saveTask({ name: taskName.trim() });
    }
  }, [saveTask, task.name, taskName]);

  const handleKeyUpTaskName = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        event.target.blur();
      }
    },
    []
  );

  const handleChangeTaskDescription = useCallback((event) => {
    setTaskDescription(event.target.value);
  }, []);

  const handleBlurTaskDescription = useCallback(() => {
    if (taskDescription !== (task.description || '')) {
      saveTask({ description: taskDescription });
    }
  }, [saveTask, task.description, taskDescription]);

  const handleChangePriority = useCallback(
    (newValue) => {
      setPriority(newValue);
      saveTask({ priority: newValue });
    },
    [saveTask]
  );

  const handleLabelChange = useCallback(
    (event) => {
      const newDepartments = event.target.value;
      setSelectedDepartments(newDepartments);
      saveTask({ departments: newDepartments });
    },
    [saveTask]
  );

  const handleLocationChange = useCallback((event) => {
    setLocation(event.target.value);
  }, []);

  const handleBlurLocation = useCallback(() => {
    if (location !== (task.location || '')) {
      saveTask({ location });
    }
  }, [location, saveTask, task.location]);

  const handleKeyUpLocation = useCallback((event) => {
    if (event.key === 'Enter') {
      event.target.blur();
    }
  }, []);

  const handleAssigneeChange = useCallback(
    (newAssignees) => {
      setSelectedAssignees(newAssignees);
      saveTask({ assignees: newAssignees });
    },
    [saveTask]
  );

  const handleDriverChange = useCallback(
    (driver) => {
      setSelectedDriver(driver);
      saveTask({ driver });
    },
    [saveTask]
  );

  const handleVehicleChange = useCallback(
    (vehicle) => {
      setSelectedVehicle(vehicle);
      saveTask({ vehicle });
    },
    [saveTask]
  );

  const handleClose = useCallback(() => {
    const hasPendingName = taskName.trim() && taskName !== task.name;
    const hasPendingDesc = taskDescription !== (task.description || '');
    const hasPendingLoc = location !== (task.location || '');

    if (hasPendingName || hasPendingDesc || hasPendingLoc) {
      saveTask({
        ...(hasPendingName && { name: taskName.trim() }),
        ...(hasPendingDesc && { description: taskDescription }),
        ...(hasPendingLoc && { location }),
      });
    }

    onCloseDetails();
  }, [
    location,
    onCloseDetails,
    saveTask,
    task.description,
    task.location,
    task.name,
    taskDescription,
    taskName,
  ]);

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;

    await addSubtask({
      taskId: task._id,
      subtask: { text: newSubtask.trim() },
    });
    setNewSubtask('');
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      await toggleSubtask({
        taskId: task._id,
        subtaskId,
      });
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await deleteSubtask({
        taskId: task._id,
        subtaskId,
      });
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  };

  const renderToolbar = (
    <KanbanDetailsToolbar
      task={task}
      onDelete={onDeleteTask}
      onUpdate={onUpdateTask}
      onCloseDetails={handleClose}
      isSaving={isSaving}
      savedAt={savedAt}
    />
  );

  const renderTabs = (
    <CustomTabs
      value={tabs.value}
      onChange={tabs.onChange}
      variant="fullWidth"
      slotProps={{ tab: { px: 0 } }}
    >
      {[
        { value: 'overview', label: 'Overview' },
        { value: 'subTasks', label: 'Subtasks' },
        { value: 'activities', label: `Activities (${task?.activities?.length})` },
      ].map((tab) => (
        <Tab key={tab.value} value={tab.value} label={tab.label} />
      ))}
    </CustomTabs>
  );

  const renderTabOverview = (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      {/* Task name */}
      <KanbanInputName
        placeholder="Task name"
        value={taskName}
        onChange={handleChangeTaskName}
        onBlur={handleBlurTaskName}
        onKeyUp={handleKeyUpTaskName}
        inputProps={{ id: `input-task-${taskName}` }}
      />

      {/* Reporter */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel>Reporter</StyledLabel>
        <Tooltip title={task.reporter?.name}>
          <Avatar alt={task.reporter?.name} src={task.reporter?.avatarUrl}>
            {task.reporter?.name?.trim().charAt(0).toUpperCase()}
          </Avatar>
        </Tooltip>
      </Box>

      {/* Modified Assignee section */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel sx={{ height: 40, lineHeight: '40px' }}>Assignee</StyledLabel>

        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
          {selectedAssignees.map((user) => (
            <Tooltip key={user.id || user._id} title={user.name}>
              <Avatar alt={user.name} src={user.avatarUrl}>
                {user?.name?.trim().charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          ))}

          <Tooltip title="Add assignees">
            <IconButton
              onClick={contacts.onTrue}
              sx={{
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              }}
            >
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          </Tooltip>

          <KanbanContactsDialog
            assignees={selectedAssignees}
            open={contacts.value}
            onClose={contacts.onFalse}
            onAssigneeChange={handleAssigneeChange}
          />
        </Box>
      </Box>

      {/* Add Driver selection after Location field */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel sx={{ height: 40, lineHeight: '40px' }}>Driver</StyledLabel>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {selectedDriver && (
            <Tooltip title={selectedDriver.driverName}>
              <Avatar alt={selectedDriver.driverName} src={selectedDriver.avatarUrl}>
                {selectedDriver?.driverName?.trim().charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          )}

          <Tooltip title={selectedDriver ? 'Change Driver' : 'Assign Driver'}>
            <IconButton
              onClick={driverDialog.onTrue}
              sx={{
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              }}
            >
              <Iconify icon={selectedDriver ? 'solar:pen-bold' : 'mingcute:add-line'} />
            </IconButton>
          </Tooltip>

          <KanbanDriverDialog
            selectedDriver={selectedDriver}
            open={driverDialog.value}
            onClose={driverDialog.onFalse}
            onDriverChange={handleDriverChange}
          />
        </Box>
      </Box>

      {/* Modified Departments section */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel sx={{ height: 40, lineHeight: '40px' }}>Departments</StyledLabel>

         <Select
          multiple
          size="small"
          value={selectedDepartments}
          onChange={handleLabelChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const colors = {
                  sales: 'primary',
                  marketing: 'secondary',
                  dispatch: 'info',
                  warehouse: 'success',
                };
                const dept = DEPARTMENTS.find((d) => d.id === value);
                return (
                  <Label key={value} variant="soft" color={colors[value] || 'default'}>
                    {dept ? dept.name : value}
                  </Label>
                );
              })}
            </Box>
          )}
          sx={{ minWidth: 200 }}
        >
          {DEPARTMENTS.map(({ id, name }) => {
            const colors = {
              sales: 'primary',
              marketing: 'secondary',
              dispatch: 'info',
              warehouse: 'success',
            };
            return (
              <MenuItem key={id} value={id}>
                <Label variant="soft" color={colors[id] || 'default'}>
                  {name}
                </Label>
              </MenuItem>
            );
          })}
        </Select>
      </Box>

      {/* After Departments section, add Location field */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel sx={{ height: 40, lineHeight: '40px' }}>Location</StyledLabel>
        <TextField
          size="small"
          value={location}
          onChange={handleLocationChange}
          onBlur={handleBlurLocation}
          onKeyUp={handleKeyUpLocation}
          placeholder="Enter location"
          sx={{ minWidth: 200 }}
        />
      </Box>

      {/* Add Vehicle selection after Driver field */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel sx={{ height: 40, lineHeight: '40px' }}>Vehicle</StyledLabel>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {selectedVehicle ? (
            <Typography variant="body2">{selectedVehicle.vehicleNo}</Typography>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.success' }}>
              No vehicle assigned
            </Typography>
          )}

          <Button
            size="small"
            startIcon={<Iconify icon={selectedVehicle ? 'eva:edit-fill' : 'mingcute:add-line'} />}
            onClick={vehicleDialog.onTrue}
          >
            {selectedVehicle ? 'Change' : 'Assign'}
          </Button>

          <KanbanVehicleDialog
            selectedVehicle={selectedVehicle}
            open={vehicleDialog.value}
            onClose={vehicleDialog.onFalse}
            onVehicleChange={handleVehicleChange}
          />
        </Box>
      </Box>

      {/* Due date */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel> Due date </StyledLabel>

        {dueDate ? (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Button
              size="small"
              variant="soft"
              onClick={datePopover.onOpen}
              startIcon={<Iconify icon="solar:calendar-date-bold" />}
            >
              {fDate(dueDate)}
            </Button>
            <Tooltip title="Clear due date">
              <IconButton
                size="small"
                onClick={handleClearDueDate}
                sx={{ color: 'text.disabled' }}
              >
                <Iconify icon="mingcute:close-line" width={16} />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Tooltip title="Add due date">
            <IconButton
              onClick={datePopover.onOpen}
              sx={{
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              }}
            >
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          </Tooltip>
        )}

        <CustomPopover
          open={datePopover.open}
          anchorEl={datePopover.anchorEl}
          onClose={datePopover.onClose}
          slotProps={{ arrow: { placement: 'top-left' } }}
        >
          <Box sx={{ p: 1 }}>
            <DateCalendar
              value={dueDate}
              onChange={(newValue) => {
                handleChangeDueDate(newValue);
                datePopover.onClose();
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pb: 1 }}>
              <Button
                size="small"
                color="error"
                onClick={handleClearDueDate}
                disabled={!dueDate}
              >
                Clear
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={datePopover.onClose}
              >
                Done
              </Button>
            </Box>
          </Box>
        </CustomPopover>
      </Box>

      {/* Priority */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel>Priority</StyledLabel>
        <KanbanDetailsPriority priority={priority} onChangePriority={handleChangePriority} />
      </Box>

      {/* Description */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel> Description </StyledLabel>
        <TextField
          fullWidth
          multiline
          size="small"
          minRows={4}
          value={taskDescription}
          onChange={handleChangeTaskDescription}
          onBlur={handleBlurTaskDescription}
          InputProps={{ sx: { typography: 'body2' } }}
        />
      </Box>

      {/* Attachments */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel>Attachments</StyledLabel>
        <KanbanDetailsAttachments attachments={task.attachments} />
      </Box>
    </Box>
  );

  const renderTabSubtasks = (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <div>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {task.subtasks?.filter((subtask) => subtask.completed)?.length || 0} of{' '}
          {task.subtasks?.length || 0}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={
            ((task.subtasks?.filter((subtask) => subtask.completed)?.length || 0) /
              (task.subtasks?.length || 1)) *
            100
          }
        />
      </div>

      <FormGroup>
        {task.subtasks?.map((subtask) => (
          <Box
            key={subtask._id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  disableRipple
                  checked={subtask.completed}
                  onChange={() => handleToggleSubtask(subtask._id)}
                />
              }
              label={subtask.text}
            />
            <IconButton size="small" color="error" onClick={() => handleDeleteSubtask(subtask._id)}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Box>
        ))}
      </FormGroup>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          placeholder="Add a subtask..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddSubtask();
            }
          }}
        />
        <Button variant="contained" onClick={handleAddSubtask} disabled={!newSubtask.trim()}>
          Add
        </Button>
      </Box>
    </Box>
  );

  const renderTabComments = (
    <>{!!task?.activities?.length && <KanbanDetailsCommentList activities={task?.activities} />}</>
  );

  return (
    <Drawer
      open={openDetails}
      onClose={handleClose}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: { xs: 1, sm: 480 } } }}
    >
      {renderToolbar}

      {renderTabs}

      <Scrollbar fillContent sx={{ py: 3, px: 2.5 }}>
        {tabs.value === 'overview' && renderTabOverview}
        {tabs.value === 'subTasks' && renderTabSubtasks}
        {tabs.value === 'activities' && renderTabComments}
      </Scrollbar>

      {tabs.value === 'activities' && <KanbanDetailsCommentInput taskId={task._id} />}
    </Drawer>
  );
}
