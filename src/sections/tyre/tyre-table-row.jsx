import React from 'react';

import { GenericTableRow } from 'src/components/table';

import { TYRE_TABLE_COLUMNS } from './tyre-table-config';

// ----------------------------------------------------------------------

export default function TyreTableRow({
    row,
    selected,
    onSelectRow,
    onViewRow,
    onEditRow,
    onDeleteRow,
    visibleColumns,
    disabledColumns,
    columnOrder,
}) {
    return (
        <GenericTableRow
            row={row}
            columns={TYRE_TABLE_COLUMNS}
            selected={selected}
            onSelectRow={onSelectRow}
            onViewRow={onViewRow}
            onEditRow={onEditRow}
            onDeleteRow={onDeleteRow}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            columnOrder={columnOrder}
        />
    );
}


