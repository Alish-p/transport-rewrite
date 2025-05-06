import * as React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import { Box, Divider, TextField, Typography } from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar';

export function ColumnSelectorList({
  TABLE_COLUMNS,
  visibleColumns,
  disabledColumns,
  handleToggleColumn,
  handleToggleAllColumns,
}) {
  // Group columns alphabetically
  const groupedColumns = TABLE_COLUMNS.reduce((acc, column) => {
    const letter = column.label[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(column);
    return acc;
  }, {});

  // Determine checkbox state for Select All
  const selectableColumns = TABLE_COLUMNS.filter((col) => !disabledColumns[col.id]);
  const allSelected = selectableColumns.every((col) => visibleColumns[col.id]);
  const someSelected = selectableColumns.some((col) => visibleColumns[col.id]);

  const handleSelectAllToggle = () => {
    const newState = !allSelected;
    handleToggleAllColumns(newState);
  };

  // Search state for filtering columns
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filter columns based on searchTerm
  const filteredGroupedColumns = React.useMemo(() => {
    if (!searchTerm) return groupedColumns;
    return Object.keys(groupedColumns).reduce((acc, letter) => {
      const filtered = groupedColumns[letter].filter((col) =>
        col.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length) acc[letter] = filtered;
      return acc;
    }, {});
  }, [groupedColumns, searchTerm]);
  const filteredKeys = Object.keys(filteredGroupedColumns).sort();

  return (
    <Box
      sx={{
        width: 240,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: 3,
        bgcolor: 'background.paper',
      }}
    >
      {/* Component Header */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle1" fontWeight="medium">
          Columns
        </Typography>
      </Box>
      {/* Search Field */}
      <Box sx={{ px: 2, pb: 1 }}>
        <TextField
          size="small"
          placeholder="Search columns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      </Box>
      <Divider />
      <Scrollbar maxHeight={500}>
        <List
          subheader={<li />}
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            '& ul': { padding: 0 },
            '& .MuiListItemButton-root:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          {/* Select All / Unselect All Header */}
          <ListSubheader
            component="div"
            sx={{
              bgcolor: 'background.default',
              position: 'sticky',
              top: 0,
              zIndex: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              px: 2,
              py: 1,
            }}
          >
            <ListItem disablePadding>
              <ListItemButton onClick={handleSelectAllToggle} dense>
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  tabIndex={-1}
                  disableRipple
                  sx={{ mr: 1 }}
                />
                <ListItemText primary={allSelected ? 'Unselect All' : 'Select All'} />
              </ListItemButton>
            </ListItem>
          </ListSubheader>

          {/* Alphabetically Grouped Columns */}
          {filteredKeys.map((letter) => (
            <li key={letter}>
              <ul>
                <ListSubheader
                  sx={{
                    bgcolor: 'background.default',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    lineHeight: 1.5,
                    px: 2,
                    py: 0.5,
                    color: 'text.secondary',
                  }}
                >
                  {letter}
                </ListSubheader>
                {filteredGroupedColumns[letter].map((column) => (
                  <ListItem key={column.id} disablePadding>
                    <ListItemButton
                      dense
                      onClick={() => handleToggleColumn(column.id)}
                      disabled={disabledColumns[column.id]}
                    >
                      <Checkbox
                        edge="start"
                        checked={visibleColumns[column.id]}
                        disabled={disabledColumns[column.id]}
                        tabIndex={-1}
                        disableRipple
                        sx={{ mr: 1 }}
                      />
                      <ListItemText primary={column.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </ul>
            </li>
          ))}
        </List>
      </Scrollbar>
    </Box>
  );
}
