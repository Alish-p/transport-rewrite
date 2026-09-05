import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';

import { useBoolean } from 'src/hooks/use-boolean';
import { useMaterialOptions } from 'src/hooks/use-material-options';

import {
  useGetTargets,
  useCreateTarget,
  useUpdateTarget,
  useDeleteTarget,
} from 'src/query/use-customer-target';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { KanbanCustomerDialog } from 'src/sections/kanban/components/kanban-customer-dialog';

// ----------------------------------------------------------------------

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// ----------------------------------------------------------------------

function TargetCardItem({ target, onEdit, onDelete }) {
  const popover = usePopover();

  const percentage = (target.achievedWeight / target.materialTarget.targetWeight) * 100;
  const isCompleted = percentage >= 100;

  return (
    <>
      <Box
        sx={{
          p: 2.5,
          borderRadius: 2,
          position: 'relative',
          bgcolor: (theme) => {
            const isDark = theme.palette.mode === 'dark';
            if (isCompleted) {
              return alpha(theme.palette.success.main, isDark ? 0.08 : 0.03);
            }
            return isDark
              ? alpha(theme.palette.grey[500], 0.08)
              : alpha(theme.palette.grey[500], 0.04);
          },
          border: (theme) => {
            const isDark = theme.palette.mode === 'dark';
            if (isCompleted) {
              return `1px solid ${alpha(theme.palette.success.main, isDark ? 0.35 : 0.24)}`;
            }
            return `1px solid ${alpha(theme.palette.grey[500], isDark ? 0.24 : 0.12)}`;
          },
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            bgcolor: (theme) => {
              const isDark = theme.palette.mode === 'dark';
              if (isCompleted) {
                return alpha(theme.palette.success.main, isDark ? 0.12 : 0.06);
              }
              return isDark
                ? alpha(theme.palette.grey[500], 0.14)
                : alpha(theme.palette.grey[500], 0.08);
            },
            borderColor: (theme) => {
              const isDark = theme.palette.mode === 'dark';
              if (isCompleted) {
                return isDark ? theme.palette.success.light : theme.palette.success.main;
              }
              return isDark ? theme.palette.primary.light : theme.palette.primary.main;
            },
            boxShadow: (theme) => {
              const isDark = theme.palette.mode === 'dark';
              const shadowColor = isCompleted ? theme.palette.success.main : theme.palette.primary.main;
              return `0 4px 16px ${alpha(shadowColor, isDark ? 0.24 : 0.1)}`;
            },
            transform: 'translateY(-2px)',
          },
        }}
      >
        <Stack spacing={2}>
          {/* Header with customer info and 3-dots menu */}
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
            <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
              <Typography
                variant="subtitle2"
                noWrap
                sx={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: !target.customer
                    ? (theme) =>
                        theme.palette.mode === 'dark'
                          ? theme.palette.primary.light
                          : theme.palette.primary.main
                    : 'text.primary',
                }}
              >
                {target.customer?.customerName || 'All Customers'}
              </Typography>

              <Box sx={{ mt: 0.75 }}>
                <Label
                  variant="soft"
                  color="primary"
                  startIcon={<Iconify icon="mdi:cube-outline" width={14} />}
                  sx={{ typography: 'caption', fontWeight: 600 }}
                >
                  {target.materialTarget.material}
                </Label>
              </Box>
            </Box>

            <IconButton
              size="small"
              color={popover.open ? 'inherit' : 'default'}
              onClick={popover.onOpen}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                },
              }}
            >
              <Iconify icon="eva:more-vertical-fill" width={20} />
            </IconButton>
          </Stack>

          {/* Progress Section */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
              sx={{ mb: 1 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                <Box
                  component="span"
                  sx={{
                    color: isCompleted
                      ? (theme) =>
                          theme.palette.mode === 'dark'
                            ? theme.palette.success.light
                            : theme.palette.success.main
                      : 'text.primary',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                  }}
                >
                  {target.achievedWeight.toLocaleString()}
                </Box>
                <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {' / '}
                  {target.materialTarget.targetWeight.toLocaleString()} Ton
                </Box>
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: isCompleted
                    ? (theme) =>
                        theme.palette.mode === 'dark'
                          ? theme.palette.success.light
                          : theme.palette.success.main
                    : (theme) =>
                        theme.palette.mode === 'dark'
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                }}
              >
                {percentage.toFixed(1)}%
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={Math.min(percentage, 100)}
              sx={{
                height: 8,
                borderRadius: 1,
                bgcolor: (theme) =>
                  isCompleted
                    ? alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.2 : 0.12)
                    : alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.08),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 1,
                  background: (theme) => {
                    const isDark = theme.palette.mode === 'dark';
                    if (isCompleted) {
                      return isDark
                        ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
                        : `linear-gradient(90deg, ${theme.palette.success.light}, ${theme.palette.success.main})`;
                    }
                    return isDark
                      ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                      : `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`;
                  },
                },
              }}
            />
          </Box>

          {/* Remaining/Excess indicator */}
          {percentage < 100 ? (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                fontWeight: 500,
              }}
            >
              <Iconify
                icon="solar:target-bold"
                width={15}
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'dark'
                      ? theme.palette.primary.light
                      : theme.palette.primary.main,
                }}
              />
              {(target.materialTarget.targetWeight - target.achievedWeight).toLocaleString()} Ton remaining
            </Typography>
          ) : (
            <Typography
              variant="caption"
              sx={{
                color: (theme) =>
                  theme.palette.mode === 'dark'
                    ? theme.palette.success.light
                    : theme.palette.success.main,
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                fontWeight: 600,
              }}
            >
              <Iconify icon="solar:check-circle-bold" width={15} />
              Target achieved! +
              {(target.achievedWeight - target.materialTarget.targetWeight).toLocaleString()} Ton extra
            </Typography>
          )}
        </Stack>
      </Box>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              onEdit(target);
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit Target
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              onDelete(target);
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete Target
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}

// ----------------------------------------------------------------------

export function LoadingTargetWidget({ sx, ...other }) {

  const [selectedDate, setSelectedDate] = useState(new Date());

  const dialog = useBoolean();
  const customerDialog = useBoolean();
  const confirmDelete = useBoolean();

  const [editingTarget, setEditingTarget] = useState(null);
  const [targetToDelete, setTargetToDelete] = useState(null);

  const [formData, setFormData] = useState({
    customer: null,
    material: '',
    targetWeight: '',
  });

  const { data: targets = [], isLoading } = useGetTargets(
    selectedDate.toISOString(),
    selectedDate.getFullYear()
  );

  const createTarget = useCreateTarget();
  const updateTarget = useUpdateTarget();
  const deleteTarget = useDeleteTarget();

  const materialOptions = useMaterialOptions();

  const handleMonthChange = (event) => {
    const newMonth = MONTHS.indexOf(event.target.value);
    const newDate = new Date(selectedDate);
    newDate.setMonth(newMonth);
    setSelectedDate(newDate);
  };

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    const newDate = new Date(selectedDate);
    newDate.setFullYear(newYear);
    setSelectedDate(newDate);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handleOpenCreate = () => {
    setEditingTarget(null);
    setFormData({ customer: null, material: '', targetWeight: '' });
    dialog.onTrue();
  };

  const handleOpenEdit = (target) => {
    setEditingTarget(target);
    setFormData({
      customer: target.customer,
      material: target.materialTarget.material,
      targetWeight: target.materialTarget.targetWeight.toString(),
    });
    dialog.onTrue();
  };

  const handleSubmit = async () => {
    if (!formData.material || !formData.targetWeight) return;

    const targetData = {
      customer: formData.customer?._id || null,
      materialTarget: {
        material: formData.material,
        targetWeight: Number(formData.targetWeight),
      },
      month: selectedDate,
      year: selectedDate.getFullYear(),
    };

    if (editingTarget) {
      updateTarget(
        { id: editingTarget._id, ...targetData },
        {
          onSuccess: () => {
            dialog.onFalse();
            setEditingTarget(null);
            setFormData({ customer: null, material: '', targetWeight: '' });
          },
        }
      );
    } else {
      createTarget(targetData, {
        onSuccess: () => {
          dialog.onFalse();
          setFormData({ customer: null, material: '', targetWeight: '' });
        },
      });
    }
  };

  const handleDeleteClick = (target) => {
    setTargetToDelete(target);
    confirmDelete.onTrue();
  };

  const handleConfirmDelete = () => {
    if (targetToDelete) {
      deleteTarget(targetToDelete._id);
      setTargetToDelete(null);
      confirmDelete.onFalse();
    }
  };

  const renderLoading = (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        p: 2.5,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
      }}
    >
      {[1, 2, 3].map((item) => (
        <Box
          key={item}
          sx={{
            p: 2.5,
            borderRadius: 2,
            border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box sx={{ flex: 1, pr: 1 }}>
                <Skeleton variant="text" width="65%" height={22} />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={22}
                  sx={{ mt: 0.75, borderRadius: 0.75 }}
                />
              </Box>
              <Skeleton variant="circular" width={28} height={28} />
            </Stack>

            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                sx={{ mb: 1 }}
              >
                <Skeleton variant="text" width={110} height={20} />
                <Skeleton variant="text" width={40} height={20} />
              </Stack>
              <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 1 }} />
            </Box>

            <Skeleton variant="text" width={120} height={18} />
          </Stack>
        </Box>
      ))}
    </Box>
  );

  const renderList = (
    <Scrollbar sx={{ maxHeight: 480 }}>
      {isLoading ? (
        renderLoading
      ) : targets.length === 0 ? (
        <EmptyContent
          title="No targets set"
          description={`Set your first target for ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`}
          sx={{ py: 6 }}
          action={
            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
              sx={{ mt: 2 }}
            >
              Set Target
            </Button>
          }
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            p: 2.5,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {targets.map((target) => (
            <TargetCardItem
              key={target._id}
              target={target}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </Box>
      )}
    </Scrollbar>
  );

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', ...sx }} {...other}>
      {/* Responsive header */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 1,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        {/* Title + Subheader */}
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:target" width={24} color="primary.main" />
            <Typography variant="h6" noWrap>
              Monthly Loading Targets
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }} noWrap>
            {`Track your loading progress for ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`}
          </Typography>
        </Box>

        {/* Controls */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flexShrink: 0, flexWrap: 'wrap', gap: 1 }}
        >
          <Select
            value={MONTHS[selectedDate.getMonth()]}
            onChange={handleMonthChange}
            size="small"
            sx={{
              minWidth: 110,
              '& .MuiSelect-select': { py: 0.75 },
            }}
          >
            {MONTHS.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={selectedDate.getFullYear()}
            onChange={handleYearChange}
            size="small"
            sx={{
              minWidth: 80,
              '& .MuiSelect-select': { py: 0.75 },
            }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>

          <Tooltip title="Add new target">
            <Button
              size="small"
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
              sx={{
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' },
              }}
            >
              Set Target
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      {renderList}

      {/* Create/Edit Dialog */}
      <Dialog open={dialog.value} onClose={dialog.onFalse} fullWidth maxWidth="xs">
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify
              icon={editingTarget ? 'solar:pen-bold' : 'mingcute:add-line'}
              width={24}
              color="primary.main"
            />
            <span>{editingTarget ? 'Edit Target' : 'Set Monthly Target'}</span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Customer (Optional - Leave blank for all)"
              value={formData.customer?.customerName || 'All Customers'}
              onClick={customerDialog.onTrue}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {formData.customer && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, customer: null });
                        }}
                      >
                        <Iconify icon="eva:close-fill" width={18} />
                      </IconButton>
                    )}
                    <Iconify icon="eva:chevron-right-fill" sx={{ color: 'text.disabled' }} />
                  </Stack>
                ),
              }}
              sx={{
                '& .MuiInputBase-input': { cursor: 'pointer' },
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Material</InputLabel>
              <Select
                value={formData.material}
                label="Material"
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 250 },
                  },
                }}
              >
                {materialOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Target Weight (Ton)"
              type="number"
              value={formData.targetWeight}
              onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
              InputProps={{
                endAdornment: (
                  <Typography variant="body2" color="text.secondary">
                    Ton
                  </Typography>
                ),
              }}
            />

            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: (theme) =>
                  alpha(
                    theme.palette.primary.main,
                    theme.palette.mode === 'dark' ? 0.12 : 0.06
                  ),
                border: (theme) =>
                  `1px dashed ${alpha(
                    theme.palette.primary.main,
                    theme.palette.mode === 'dark' ? 0.35 : 0.24
                  )}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'dark'
                      ? theme.palette.primary.light
                      : theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontWeight: 600,
                }}
              >
                <Iconify icon="mdi:calendar" width={16} />
                For {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={dialog.onFalse} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.material || !formData.targetWeight}
            startIcon={<Iconify icon={editingTarget ? 'mdi:check' : 'mingcute:add-line'} />}
          >
            {editingTarget ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDelete.value}
        onClose={() => {
          setTargetToDelete(null);
          confirmDelete.onFalse();
        }}
        title="Delete Target"
        content={
          targetToDelete ? (
            <>
              Are you sure you want to delete the target for{' '}
              <strong>{targetToDelete.customer?.customerName || 'All Customers'}</strong> -{' '}
              <strong>{targetToDelete.materialTarget?.material}</strong>?
            </>
          ) : (
            'Are you sure you want to delete this target?'
          )
        }
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        }
      />

      <KanbanCustomerDialog
        open={customerDialog.value}
        onClose={customerDialog.onFalse}
        onCustomerChange={(customer) => setFormData({ ...formData, customer })}
      />
    </Card>
  );
}
