import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { useDeleteDieselPrice, usePaginatedDieselPrices } from 'src/query/use-diesel-prices';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import DieselPriceForm from '../diesel-price-form';

export function PumpDieselPricesWidget({ pump, title = 'Diesel Prices', ...other }) {
  const table = useTable({ defaultOrderBy: 'startDate', defaultRowsPerPage: 5 });

  const { data, isLoading } = usePaginatedDieselPrices({
    pumpId: pump._id,
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
  });

  const dieselPrices = data?.dieselPrices || [];
  const totalCount = data?.total || 0;

  const formDialog = useBoolean();
  const [current, setCurrent] = useState(null);
  const deleteDieselPrice = useDeleteDieselPrice();

  const handleOpenCreate = () => {
    setCurrent(null);
    formDialog.onTrue();
  };

  const handleOpenEdit = (row) => {
    setCurrent(row);
    formDialog.onTrue();
  };

  const handleDelete = (id) => {
    deleteDieselPrice(id);
  };

  const handleClose = () => {
    setCurrent(null);
    formDialog.onFalse();
  };

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        sx={{ mb: 3 }}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenCreate}
          >
            New Diesel Price
          </Button>
        }
      />

      <Scrollbar sx={{ minHeight: 401, maxHeight: 401 }}>
        <Table>
          <TableHeadCustom
            headLabel={[
              { id: 'index', label: 'No.' },
              { id: 'price', label: 'Price' },
              { id: 'time', label: 'Time' },
              { id: 'actions', label: 'Actions' },
            ]}
          />

          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : dieselPrices.length ? (
              dieselPrices.map((row, idx) => (
                <TableRow key={row._id}>
                  <TableCell>{table.page * table.rowsPerPage + idx + 1}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{fDateRangeShortLabel(row.startDate, row.endDate)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton onClick={() => handleOpenEdit(row)}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(row._id)}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData notFound />
            )}
          </TableBody>
        </Table>
      </Scrollbar>

      <TablePaginationCustom
        count={totalCount}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />

      <Dialog fullWidth maxWidth="sm" open={formDialog.value} onClose={handleClose}>
        <DialogTitle>{current ? 'Edit Diesel Price' : 'New Diesel Price'}</DialogTitle>
        <DialogContent>
          <DieselPriceForm currentDieselPrice={current} pump={pump} onSuccess={handleClose} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default PumpDieselPricesWidget;
