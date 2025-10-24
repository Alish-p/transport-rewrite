import { useNavigate } from 'react-router';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components/router-link';

import { useFilters } from 'src/hooks/use-filters';
import { useColumnVisibility } from 'src/hooks/use-column-visibility';

import { paramCase } from 'src/utils/change-case';
import { exportToExcel, prepareDataForExport } from 'src/utils/export-to-excel';

import RouteListPdf from 'src/pdfs/route-list-pdf';
import { DashboardContent } from 'src/layouts/dashboard';
import { useDeleteRoute, usePaginatedRoutes } from 'src/query/use-route';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { useTenantContext } from 'src/auth/tenant';

import RouteTableRow from '../route-table-row';
import { TABLE_COLUMNS } from '../route-table-config';
import RouteTableToolbar from '../route-table-toolbar';
import RouteTableFiltersResult from '../route-table-filters-result';

const STORAGE_KEY = 'route-table-columns';

const defaultFilters = {
  routeName: '',
  fromPlace: '',
  toPlace: '',
  customer: '',
  routeType: 'all',
};

export function RouteListView() {
  const tenant = useTenantContext();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate', syncToUrl: true });
  const theme = useTheme();
  const navigate = useNavigate();
  const deleteRoute = useDeleteRoute();

  const { filters, handleFilters, handleResetFilters, canReset } = useFilters(defaultFilters, {
    onResetPage: table.onResetPage,
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const {
    visibleColumns,
    visibleHeaders,
    columnOrder,
    disabledColumns,
    toggleColumnVisibility,
    toggleAllColumnsVisibility,
    moveColumn,
    resetColumns,
    canReset: canResetColumns,
  } = useColumnVisibility(TABLE_COLUMNS, STORAGE_KEY);

  const { data, isLoading } = usePaginatedRoutes({
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
    routeName: filters.routeName || undefined,
    fromPlace: filters.fromPlace || undefined,
    toPlace: filters.toPlace || undefined,
    customer: filters.customer || undefined,
    isCustomerSpecific: filters.routeType === 'all' ? undefined : filters.routeType === 'customer',
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data) {
      setTableData(data.routes || data.results || []);
    } else {
      setTableData([]);
    }
  }, [data]);

  const { total, totalGeneric, totalCustomerSpecific } = data || {};
  const totalCount = total || 0;
  const notFound = !tableData.length && canReset;

  const handleEditRow = (id) => {
    navigate(paths.dashboard.route.edit(paramCase(id)));
  };

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.route.details(id));
    },
    [router]
  );

  const handleSelectCustomer = useCallback(
    (customer) => {
      setSelectedCustomer(customer);
      handleFilters('customer', customer._id);
    },
    [handleFilters]
  );

  const handleClearCustomer = useCallback(() => {
    setSelectedCustomer(null);
    handleFilters('customer', '');
  }, [handleFilters]);

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: totalCount },
    {
      value: 'customer',
      label: 'Customer Specific',
      color: 'info',
      count: totalCustomerSpecific,
    },
    { value: 'general', label: 'General', color: 'success', count: totalGeneric },
  ];

  const handleFilterRouteType = useCallback(
    (event, newValue) => {
      handleFilters('routeType', newValue);
    },
    [handleFilters]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Route List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Route', href: paths.dashboard.route.root },
          { name: 'Route List' },
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
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
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
                isLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <Label
                    variant={tab.value === filters.routeType ? 'filled' : 'soft'}
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                )
              }
            />
          ))}
        </Tabs>

        <RouteTableToolbar
          filters={filters}
          onFilters={handleFilters}
          visibleColumns={visibleColumns}
          disabledColumns={disabledColumns}
          onToggleColumn={toggleColumnVisibility}
          onToggleAllColumns={toggleAllColumnsVisibility}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={handleSelectCustomer}
          onResetColumns={resetColumns}
          canResetColumns={canResetColumns}
        />

        {canReset && (
          <RouteTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={() => {
              handleResetFilters();
              setSelectedCustomer(null);
            }}
            selectedCustomerName={selectedCustomer?.customerName}
            onRemoveCustomer={handleClearCustomer}
            results={totalCount}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => row._id)
              )
            }
            action={
              <Stack direction="row">
                <Tooltip title="Download Excel">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      const selectedRows = tableData.filter(({ _id }) =>
                        table.selected.includes(_id)
                      );
                      const visibleCols = Object.keys(visibleColumns).filter(
                        (c) => visibleColumns[c]
                      );
                      exportToExcel(
                        prepareDataForExport(selectedRows, TABLE_COLUMNS, visibleCols, columnOrder),
                        'filtered'
                      );
                    }}
                  >
                    <Iconify icon="file-icons:microsoft-excel" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Download PDF">
                  <PDFDownloadLink
                    document={(() => {
                      const selectedRows = tableData.filter(({ _id }) =>
                        table.selected.includes(_id)
                      );
                      return <RouteListPdf routes={selectedRows} tenant={tenant} />;
                    })()}
                    fileName="Route-list.pdf"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {({ loading }) => (
                      <IconButton color="primary">
                        <Iconify icon={loading ? 'line-md:loading-loop' : 'fa:file-pdf-o'} />
                      </IconButton>
                    )}
                  </PDFDownloadLink>
                </Tooltip>
              </Stack>
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={visibleHeaders}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onOrderChange={moveColumn}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row._id)
                  )
                }
              />
              <TableBody>
                {isLoading
                  ? Array.from({ length: table.rowsPerPage }).map((_, i) => (
                      <TableSkeleton key={i} />
                    ))
                  : tableData.map((row) => (
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
                        columnOrder={columnOrder}
                      />
                    ))}
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={totalCount}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
