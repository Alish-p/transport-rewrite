import { useMemo, useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { useOptions, useDeleteOption } from 'src/query/use-options';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
    useTable,
    TableNoData,
    TableSkeleton,
    TableHeadCustom,
    GenericTableRow,
    TablePaginationCustom,
} from 'src/components/table';

import { GenericOptionDialog } from './generic-option-dialog';
import { GENERIC_OPTION_COLUMNS } from './generic-option-table-config';

export function GenericOptionSettings({
    title,
    group,
    addButtonLabel,
    columns = GENERIC_OPTION_COLUMNS,
    usageFor,
    usageField,
}) {
    const table = useTable({ defaultOrderBy: 'label' });
    const dialog = useBoolean();

    const [currentOption, setCurrentOption] = useState(null);
    const [search, setSearch] = useState('');

    const { data: options = [], isLoading } = useOptions(
        group,
        {},
        { usageFor, usageField }
    );
    const deleteOption = useDeleteOption();

    const filteredData = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return options;
        return options.filter((item) =>
            (item.label || item.value || '').toLowerCase().includes(query)
        );
    }, [options, search]);

    const totalCount = filteredData.length;
    const notFound = !filteredData.length;

    const pageData = useMemo(() => {
        const start = table.page * table.rowsPerPage;
        return filteredData.slice(start, start + table.rowsPerPage);
    }, [filteredData, table.page, table.rowsPerPage]);

    const visibleColumns = useMemo(
        () =>
            columns.reduce((acc, column) => {
                acc[column.id] = true;
                return acc;
            }, {}),
        [columns]
    );

    const disabledColumns = useMemo(
        () =>
            columns.reduce((acc, column) => {
                acc[column.id] = column.disabled;
                return acc;
            }, {}),
        [columns]
    );

    const handleEditRow = (row) => {
        setCurrentOption(row);
        dialog.onTrue();
    };

    const handleAdd = () => {
        setCurrentOption(null);
        dialog.onTrue();
    };

    const handleDeleteRow = async (row) => {
        try {
            await deleteOption(row._id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h6">{title}</Typography>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={handleAdd}
                    color="primary"
                >
                    {addButtonLabel}
                </Button>
            </Stack>

            <Card>
                <Stack spacing={2} sx={{ p: 2, pb: 0 }}>
                    <TextField
                        fullWidth
                        placeholder="Search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" width={18} />
                                </InputAdornment>
                            ),
                        }}
                        size="small"
                    />
                </Stack>

                <TableContainer sx={{ position: 'relative', overflow: 'unset', mt: 1 }}>
                    <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                            <TableHeadCustom
                                order={table.order}
                                orderBy={table.orderBy}
                                headLabel={columns}
                                onOrderChange={table.onSort}
                            />

                            <TableBody>
                                {isLoading
                                    ? Array.from({ length: table.rowsPerPage }).map((_, i) => (
                                        <TableSkeleton key={i} />
                                    ))
                                    : pageData.map((row) => (
                                        <GenericTableRow
                                            key={row._id}
                                            row={row}
                                            columns={columns}
                                            selected={table.selected.includes(row._id)}
                                            onSelectRow={() => table.onSelectRow(row._id)}
                                            onEditRow={() => handleEditRow(row)}
                                            onDeleteRow={() => handleDeleteRow(row)}
                                            visibleColumns={visibleColumns}
                                            disabledColumns={disabledColumns}
                                            columnOrder={columns.map((c) => c.id)}
                                            hideSelection
                                        />
                                    ))}

                                <TableNoData notFound={notFound} />
                            </TableBody>
                        </Table>
                    </Scrollbar>

                    <TablePaginationCustom
                        count={totalCount}
                        page={table.page}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                    />
                </TableContainer>
            </Card>

            <GenericOptionDialog
                open={dialog.value}
                onClose={dialog.onFalse}
                currentOption={currentOption}
                group={group}
                title={title} // Pass title to dialog for "Add [Title]" / "Edit [Title]"
            />
        </>
    );
}
