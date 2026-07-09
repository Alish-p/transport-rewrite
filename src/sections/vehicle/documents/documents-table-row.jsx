import React from 'react';
import { useNavigate } from 'react-router';

import { paths } from 'src/routes/paths';

import { GenericTableRow } from 'src/components/table';

import { TABLE_COLUMNS } from './config/table-columns';

export default function DocumentsTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  visibleColumns,
  disabledColumns,
  columnOrder,
}) {
  const navigate = useNavigate();

  const handleView = (r) => {
    navigate(paths.dashboard.vehicle.documentDetails(r._id));
  };

  const handleEdit = (r) => {
    navigate(paths.dashboard.vehicle.editDocument(r._id));
  };

  const handleDelete = (r) => {
    onDeleteRow?.(r);
  };

  return (
    <GenericTableRow
      row={row}
      columns={TABLE_COLUMNS}
      selected={selected}
      onSelectRow={onSelectRow}
      onViewRow={handleView}
      onEditRow={handleEdit}
      onDeleteRow={handleDelete}
      visibleColumns={visibleColumns}
      disabledColumns={disabledColumns}
      columnOrder={columnOrder}
    />
  );
}
