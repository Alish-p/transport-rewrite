import { useState, useEffect } from 'react';

import {
  Box,
  List,
  Dialog,
  Button,
  Divider,
  ListItem,
  Checkbox,
  Typography,
  DialogTitle,
  ListItemText,
  ListItemIcon,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

export default function KanbanSubtripMultiSelectDialog({
  open,
  onClose,
  subtrips = [],
  selectedSubtrips = [],
  onChange,
  title = 'Select Subtrips',
}) {
  const [localSelectedSubtrips, setLocalSelectedSubtrips] = useState([]);

  useEffect(() => {
    setLocalSelectedSubtrips(selectedSubtrips);
  }, [selectedSubtrips]);

  const handleToggle = (subtripId) => {
    const currentIndex = localSelectedSubtrips.indexOf(subtripId);
    const newSelectedSubtrips = [...localSelectedSubtrips];

    if (currentIndex === -1) {
      newSelectedSubtrips.push(subtripId);
    } else {
      newSelectedSubtrips.splice(currentIndex, 1);
    }

    setLocalSelectedSubtrips(newSelectedSubtrips);
  };

  const handleSelectAll = () => {
    const allSubtripIds = subtrips.map((subtrip) => subtrip._id);
    setLocalSelectedSubtrips(allSubtripIds);
  };

  const handleDeselectAll = () => {
    setLocalSelectedSubtrips([]);
  };

  const handleSave = () => {
    onChange(localSelectedSubtrips);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleSelectAll}
            startIcon={<Iconify icon="mdi:check-all" />}
          >
            Select All
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDeselectAll}
            startIcon={<Iconify icon="mdi:close-box-multiple" />}
          >
            Deselect All
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {subtrips.map((subtrip) => {
            console.log({ subtrip });
            const isSelected = localSelectedSubtrips.indexOf(subtrip._id) !== -1;
            return (
              <ListItem
                key={subtrip._id}
                button
                onClick={() => handleToggle(subtrip._id)}
                sx={{ mb: 1, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
              >
                <ListItemIcon>
                  <Checkbox edge="start" checked={isSelected} tabIndex={-1} disableRipple />
                </ListItemIcon>
                <ListItemText
                  primary={subtrip._id}
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {`${subtrip?.customerId?.customerName} | ${subtrip?.loadingPoint} → ${subtrip?.unloadingPoint}` ||
                        'No description available'}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
