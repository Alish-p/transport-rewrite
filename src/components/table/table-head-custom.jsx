import { CSS } from '@dnd-kit/utilities';
import { useSortable, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import {
  useSensor,
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
  PointerSensor,
  closestCenter,
} from '@dnd-kit/core';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

// ----------------------------------------------------------------------

function DraggableHeaderCell({ headCell, order, orderBy, onSort }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: headCell.id,
  });

  return (
    <TableCell
      ref={setNodeRef}
      align={headCell.align || 'left'}
      sortDirection={orderBy === headCell.id ? order : false}
      sx={{
        width: headCell.width,
        minWidth: headCell.minWidth,
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      {...attributes}
      {...listeners}
    >
      {onSort ? (
        <TableSortLabel
          hideSortIcon
          active={orderBy === headCell.id}
          direction={orderBy === headCell.id ? order : 'asc'}
          onClick={() => onSort(headCell.id)}
        >
          {headCell.label}

          {orderBy === headCell.id ? (
            <Box sx={{ ...visuallyHidden }}>
              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
            </Box>
          ) : null}
        </TableSortLabel>
      ) : (
        headCell.label
      )}
    </TableCell>
  );
}

export function TableHeadCustom({
  sx,
  order,
  onSort,
  orderBy,
  headLabel,
  rowCount = 0,
  numSelected = 0,
  onSelectAllRows,
  onOrderChange,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    if (onOrderChange) {
      onOrderChange(active.id, over.id);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={headLabel.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
        <TableHead sx={sx}>
          <TableRow>
            {onSelectAllRows && (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={!!numSelected && numSelected < rowCount}
                  checked={!!rowCount && numSelected === rowCount}
                  onChange={(event) => onSelectAllRows(event.target.checked)}
                  inputProps={{
                    name: 'select-all-rows',
                    'aria-label': 'select all rows',
                  }}
                />
              </TableCell>
            )}

            {headLabel.map((headCell) => (
              <DraggableHeaderCell
                key={headCell.id}
                headCell={headCell}
                order={order}
                orderBy={orderBy}
                onSort={onSort}
              />
            ))}
          </TableRow>
        </TableHead>
      </SortableContext>
    </DndContext>
  );
}
