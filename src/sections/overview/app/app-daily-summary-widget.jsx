import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { useTheme } from '@mui/material/styles';

import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTabs } from 'src/hooks/use-tabs';

import { fCurrency, fShortenNumber } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

import { useDailySummary } from 'src/query/use-dashboard';

// ----------------------------------------------------------------------

export function AppDailySummaryWidget({ sx, ...other }) {
  const theme = useTheme();

  const [selectedDate, setSelectedDate] = useState(dayjs());

  const tabs = useTabs('created');

  const dateParam = useMemo(() => selectedDate?.format('YYYY-MM-DD'), [selectedDate]);

  const { data, isLoading } = useDailySummary(dateParam);

  const tabsConfig = useMemo(() => {
    const created = data?.subtrips?.created || { count: 0, list: [] };
    const loaded = data?.subtrips?.loaded || { count: 0, list: [] };
    const received = data?.subtrips?.received || { count: 0, list: [] };
    const invoices = data?.invoices || { count: 0, amount: 0, list: [] };
    const transporterPayments = data?.transporterPayments || { count: 0, amount: 0, list: [] };

    return [
      {
        value: 'created',
        label: 'Subtrips Created',
        icon: 'solar:document-add-bold-duotone',
        count: created.count || 0,
        amount: 0,
      },
      {
        value: 'loaded',
        label: 'Subtrips Loaded',
        icon: 'mdi:cube-send',
        count: loaded.count || 0,
        amount: 0,
      },
      {
        value: 'received',
        label: 'POD Received',
        icon: 'solar:inbox-bold-duotone',
        count: received.count || 0,
        amount: 0,
      },
      {
        value: 'invoices',
        label: 'Invoices Generated',
        icon: 'mdi:file-document-edit-outline',
        count: invoices.count || 0,
        amount: invoices.amount || 0,
      },
      {
        value: 'transporterPayments',
        label: 'TPayments Generated',
        icon: 'ri:money-rupee-circle-line',
        count: transporterPayments.count || 0,
        amount: transporterPayments.amount || 0,
      },
    ];
  }, [data]);

  const renderHeader = (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' } }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            mb: 1,
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            typography: 'subtitle2',
          }}
        >
          Daily summary
          <Tooltip title="Pick a date to view daily activity">
            <Iconify width={16} icon="eva:info-outline" sx={{ color: 'text.disabled' }} />
          </Tooltip>
        </Box>
        <Box sx={{ typography: 'h4' }}>{fDate(dateParam, 'DD MMM YYYY')}</Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <DatePicker
          label="Select date"
          value={selectedDate}
          onChange={(value) => value && setSelectedDate(value)}
          disableFuture
        />
      </Box>
    </Box>
  );

  const renderTabs = (
    <CustomTabs
      value={tabs.value}
      onChange={tabs.onChange}
      variant="scrollable"
      allowScrollButtonsMobile
      sx={{ my: 3, borderRadius: 2 }}
      slotProps={{ indicator: { borderRadius: 1.5, boxShadow: theme.customShadows.z4 }, tab: { p: 2.5 } }}
    >
      {tabsConfig.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          label={
            <Box
              sx={{
                width: 1,
                display: 'flex',
                gap: { xs: 1, md: 2 },
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  display: { xs: 'none', md: 'inline-flex' },
                }}
              >
                <Iconify width={36} icon={tab.icon} />
              </Box>

              <div>
                <Box sx={{ mb: 0.5, gap: 0.5, display: 'flex', alignItems: 'center', typography: 'subtitle2' }}>
                  {tab.label}
                </Box>

                <Box sx={{ typography: 'h6' }}>
                  {['invoices', 'transporterPayments'].includes(tab.value)
                    ? fShortenNumber(tab.amount || 0)
                    : tab.count || 0}
                </Box>
              </div>
            </Box>
          }
        />
      ))}
    </CustomTabs>
  );

  const currentList = useMemo(() => {
    if (!data) return [];
    switch (tabs.value) {
      case 'created':
        return data?.subtrips?.created?.list || [];
      case 'loaded':
        return data?.subtrips?.loaded?.list || [];
      case 'received':
        return data?.subtrips?.received?.list || [];
      case 'invoices':
        return data?.invoices?.list || [];
      case 'transporterPayments':
        return data?.transporterPayments?.list || [];
      default:
        return [];
    }
  }, [data, tabs.value]);

  const headLabel = useMemo(() => {
    switch (tabs.value) {
      case 'created':
      case 'loaded':
      case 'received':
        return [
          { id: 'index', label: 'No.' },
          { id: 'subtripNo', label: 'Subtrip No' },
          { id: 'vehicleNo', label: 'Vehicle' },
          { id: 'driver', label: 'Driver' },
          { id: 'customer', label: 'Customer' },
          { id: 'route', label: 'Route' },
          { id: 'date', label: 'Date' },
          { id: 'weight', label: 'Weight (T)' },
          { id: 'rate', label: 'Rate' },
        ];
      case 'invoices':
        return [
          { id: 'index', label: 'No.' },
          { id: 'invoiceNo', label: 'Invoice' },
          { id: 'customer', label: 'Customer' },
          { id: 'issueDate', label: 'Issue Date' },
          { id: 'status', label: 'Status' },
          { id: 'total', label: 'Net Total' },
        ];
      case 'transporterPayments':
        return [
          { id: 'index', label: 'No.' },
          { id: 'paymentId', label: 'Payment Id' },
          { id: 'transporter', label: 'Transporter' },
          { id: 'issueDate', label: 'Issue Date' },
          { id: 'status', label: 'Status' },
          { id: 'amount', label: 'Net Income' },
        ];
      default:
        return [];
    }
  }, [tabs.value]);

  const renderTable = (
    <Scrollbar sx={{ minHeight: 340, maxHeight: 420 }}>
      <Table size="small" sx={{ minWidth: 960 }}>
        <TableHeadCustom headLabel={headLabel} />
        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : currentList && currentList.length ? (
            <>
              {currentList.map((row, idx) => {
                if (['created', 'loaded', 'received'].includes(tabs.value)) {
                  const subtripId = row?._id;
                  const vehicleNo = row?.vehicleId?.vehicleNo || '-';
                  const driverName = row?.driverId?.driverName || '-';
                  const customerName = row?.customerId?.customerName || '-';
                  const route = `${row?.loadingPoint || '-'} → ${row?.unloadingPoint || '-'}`;
                  return (
                    <TableRow key={subtripId}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <Link
                          component={RouterLink}
                          to={paths.dashboard.subtrip.details(subtripId)}
                          variant="body2"
                          noWrap
                          sx={{ color: 'primary.main' }}
                        >
                          {row?.subtripNo}
                        </Link>
                      </TableCell>
                      <TableCell>{vehicleNo}</TableCell>
                      <TableCell>{driverName}</TableCell>
                      <TableCell>{customerName}</TableCell>
                      <TableCell>{route}</TableCell>
                      <TableCell>{fDate(row?.startDate)}</TableCell>
                      <TableCell>{row?.loadingWeight ?? '-'}</TableCell>
                      <TableCell>{row?.rate ? fCurrency(row.rate) : '-'}</TableCell>
                    </TableRow>
                  );
                }

                if (tabs.value === 'invoices') {
                  return (
                    <TableRow key={row?._id || idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <Link
                          component={RouterLink}
                          to={paths.dashboard.invoice.details(row?._id)}
                          variant="body2"
                          noWrap
                          sx={{ color: 'primary.main' }}
                        >
                          {row?.invoiceNo}
                        </Link>
                      </TableCell>
                      <TableCell>{row?.customerName}</TableCell>
                      <TableCell>{fDate(row?.issueDate)}</TableCell>
                      <TableCell>{row?.status}</TableCell>
                      <TableCell>{row?.netTotal ? fCurrency(row.netTotal) : '-'}</TableCell>
                    </TableRow>
                  );
                }

                if (tabs.value === 'transporterPayments') {
                  return (
                    <TableRow key={row?._id || idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <Link
                          component={RouterLink}
                          to={paths.dashboard.transporterPayment.details(row?._id)}
                          variant="body2"
                          noWrap
                          sx={{ color: 'primary.main' }}
                        >
                          {row?.paymentId}
                        </Link>
                      </TableCell>
                      <TableCell>{row?.transporterName}</TableCell>
                      <TableCell>{fDate(row?.issueDate)}</TableCell>
                      <TableCell>{row?.status}</TableCell>
                      <TableCell>{row?.netIncome ? fCurrency(row.netIncome) : '-'}</TableCell>
                    </TableRow>
                  );
                }

                return null;
              })}
            </>
          ) : (
            <TableNoData notFound />
          )}
        </TableBody>
      </Table>
    </Scrollbar>
  );

  return (
    <Card sx={{ p: 3, ...sx }} {...other}>
      {renderHeader}

      {renderTabs}

      {renderTable}
    </Card>
  );
}

