import { useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import {
    useDeletePartLocation,
    usePaginatedPartLocations,
} from 'src/query/use-part-location';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
    useTable,
    TableNoData,
    TableSkeleton,
    TableHeadCustom,
    TablePaginationCustom,
} from 'src/components/table';

import { PartLocationDialog } from 'src/sections/part-location/part-location-dialog';
import PartLocationTableRow from 'src/sections/part-location/part-location-table-row';
import { TABLE_COLUMNS } from 'src/sections/part-location/part-location-table-config';

// ----------------------------------------------------------------------

export function PartLocationSettings() {
    const table = useTable({ defaultOrderBy: 'name' });
    const dialog = useBoolean();
    const deletePartLocation = useDeletePartLocation();

    const [currentPartLocation, setCurrentPartLocation] = useState(null);
    const filters = useSetState({ search: '' });

    const { data, isLoading } = usePaginatedPartLocations({
        search: filters.state.search || undefined,
        page: table.page + 1,
        rowsPerPage: table.rowsPerPage,
    });

    const tableData = data?.locations || data?.partLocations || data?.results || [];
    const totalCount = data?.total || tableData.length;
    const notFound = (!tableData.length && !!filters.state.search) || !tableData.length;

    const handleEditRow = (row) => {
        setCurrentPartLocation(row);
        dialog.onTrue();
    };

    const handleAdd = () => {
        setCurrentPartLocation(null);
        dialog.onTrue();
    };

    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h6">Part Locations</Typography>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={handleAdd}
                    color="primary"
                >
                    Add Part Location
                </Button>
            </Stack>

            <Card>
                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                            <TableHeadCustom
                                order={table.order}
                                orderBy={table.orderBy}
                                headLabel={TABLE_COLUMNS}
                                onOrderChange={table.onSort}
                            />

                            <TableBody>
                                {isLoading
                                    ? Array.from({ length: table.rowsPerPage }).map((_, i) => (
                                        <TableSkeleton key={i} />
                                    ))
                                    : tableData.map((row) => {
                                        const visibleColumns = TABLE_COLUMNS.reduce(
                                            (acc, column) => {
                                                acc[column.id] = true;
                                                return acc;
                                            },
                                            {}
                                        );

                                        const disabledColumns = TABLE_COLUMNS.reduce(
                                            (acc, column) => {
                                                acc[column.id] = column.disabled;
                                                return acc;
                                            },
                                            {}
                                        );

                                        return (
                                            <PartLocationTableRow
                                                key={row._id}
                                                row={row}
                                                onEditRow={() => handleEditRow(row)}
                                                onDeleteRow={() => deletePartLocation(row._id)}
                                                visibleColumns={visibleColumns}
                                                disabledColumns={disabledColumns}
                                                hideSelection
                                            />
                                        );
                                    })}

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

            <PartLocationDialog
                open={dialog.value}
                onClose={dialog.onFalse}
                currentPartLocation={currentPartLocation}
            />
        </>
    );
}
