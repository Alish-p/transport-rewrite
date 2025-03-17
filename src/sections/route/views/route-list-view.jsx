import { useMemo, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
// @mui
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

// _mock

import { useNavigate } from 'react-router';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components/router-link';

import { useBoolean } from 'src/hooks/use-boolean';

import { paramCase } from 'src/utils/change-case';
import { exportToExcel } from 'src/utils/export-to-excel';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import RouteTableRow from '../route-table-row';
import RouteTableToolbar from '../route-table-toolbar';
import RouteAnalytics from '../widgets/route-analytic';
import { useDeleteRoute } from '../../../query/use-route';
import RouteTableFiltersResult from '../route-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'routeName', label: 'Route Name', type: 'string' },
  { id: 'fromPlace', label: 'From Place', type: 'string' },
  { id: 'toPlace', label: 'To Place', type: 'string' },
  { id: 'customer', label: 'Customer', type: 'string' },
  { id: 'tollAmt', label: 'Toll Amount', type: 'number' },
  { id: 'noOfDays', label: 'Number of Days', type: 'number' },
  { id: 'distance', label: 'Distance', type: 'number' },
  { id: 'validFromDate', label: 'Valid From Date', type: 'date' },
  { id: '' },
];

const defaultFilters = {
  routeName: '',
  fromPlace: '',
  toPlace: '',
  routeType: 'all',
};

// ----------------------------------------------------------------------

export function RouteListView({ routes }) {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const theme = useTheme();

  const navigate = useNavigate();
  const deleteRoute = useDeleteRoute();

  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    if (routes?.length) {
      setTableData(routes);
    }
  }, [routes]);

  const [tableData, setTableData] = useState([]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !!filters.routeName || !!filters.fromPlace || !!filters.toPlace;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleEditRow = (id) => {
    navigate(paths.dashboard.route.edit(paramCase(id)));
  };

  const handleDeleteRows = useCallback(() => {}, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.route.details(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Add state for column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    routeName: true,
    fromPlace: true,
    toPlace: true,
    customer: true,
    tollAmt: true,
    noOfDays: true,
    distance: true,
    validFromDate: true,
  });

  // Define which columns should be disabled (always visible)
  const disabledColumns = useMemo(
    () => ({
      routeName: true, // Route name should always be visible
      fromPlace: false,
      toPlace: false,
      customer: false,
      tollAmt: false,
      noOfDays: false,
      distance: false,
      validFromDate: false,
    }),
    []
  );

  // Add handler for toggling column visibility
  const handleToggleColumn = useCallback(
    (columnName) => {
      // Don't toggle if the column is disabled
      if (disabledColumns[columnName]) return;

      setVisibleColumns((prev) => ({
        ...prev,
        [columnName]: !prev[columnName],
      }));
    },
    [disabledColumns]
  );

  // Filter the table head based on visible columns
  const visibleTableHead = TABLE_HEAD.filter(
    (column) => column.id === '' || visibleColumns[column.id]
  );

  const getRouteLength = (type) => {
    if (type === 'all') return tableData.length;
    if (type === 'customer') return tableData.filter((item) => item.isCustomerSpecific).length;
    return tableData.filter((item) => !item.isCustomerSpecific).length;
  };

  const getPercentByType = (type) => {
    const length = getRouteLength(type);
    return (length / tableData.length) * 100;
  };

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: getRouteLength('all') },
    {
      value: 'customer',
      label: 'Customer Specific',
      color: 'info',
      count: getRouteLength('customer'),
    },
    { value: 'general', label: 'General', color: 'success', count: getRouteLength('general') },
  ];

  const handleFilterRouteType = useCallback(
    (event, newValue) => {
      handleFilters('routeType', newValue);
    },
    [handleFilters]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Route List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Route',
              href: paths.dashboard.route.root,
            },
            {
              name: 'Route List',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.route.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Route
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {/* Add Analytics Section */}
        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <RouteAnalytics
                title="Total"
                total={getRouteLength('all')}
                percent={100}
                icon="solar:route-bold-duotone"
                color={theme.palette.info.main}
              />

              <RouteAnalytics
                title="Customer Specific"
                total={getRouteLength('customer')}
                percent={getPercentByType('customer')}
                icon="solar:users-group-rounded-bold-duotone"
                color={theme.palette.warning.main}
              />

              <RouteAnalytics
                title="General"
                total={getRouteLength('general')}
                percent={getPercentByType('general')}
                icon="solar:road-bold-duotone"
                color={theme.palette.success.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        {/* Table Section */}
        <Card>
          {/* Add Tabs */}
          <Tabs
            value={filters.routeType}
            onChange={handleFilterRouteType}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.routeType) && 'filled') ||
                      'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <RouteTableToolbar
            filters={filters}
            onFilters={handleFilters}
            tableData={tableData}
            visibleColumns={visibleColumns}
            disabledColumns={disabledColumns}
            onToggleColumn={handleToggleColumn}
          />

          {canReset && (
            <RouteTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row._id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="iconamoon:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        const selectedRows = tableData.filter(({ _id }) =>
                          table.selected.includes(_id)
                        );
                        exportToExcel(selectedRows, 'filtered');
                      }}
                    >
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={visibleTableHead}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row._id)
                    )
                  }
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <RouteTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => deleteRoute(row._id)}
                        visibleColumns={visibleColumns}
                        disabledColumns={disabledColumns}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </DashboardContent>

      {/* Delete Confirmations dialogue */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

// filtering logic
function applyFilter({ inputData, comparator, filters }) {
  const { routeName, fromPlace, toPlace, routeType } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (routeName) {
    inputData = inputData.filter(
      (record) =>
        record.routeName && record.routeName.toLowerCase().indexOf(routeName.toLowerCase()) !== -1
    );
  }

  if (fromPlace) {
    inputData = inputData.filter(
      (record) =>
        record.fromPlace && record.fromPlace.toLowerCase().indexOf(fromPlace.toLowerCase()) !== -1
    );
  }

  if (toPlace) {
    inputData = inputData.filter(
      (record) =>
        record.toPlace && record.toPlace.toLowerCase().indexOf(toPlace.toLowerCase()) !== -1
    );
  }

  if (routeType !== 'all') {
    inputData = inputData.filter((record) =>
      routeType === 'customer' ? record.isCustomerSpecific : !record.isCustomerSpecific
    );
  }

  return inputData;
}
