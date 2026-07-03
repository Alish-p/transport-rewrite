import dayjs from 'dayjs';
import { useMemo, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fToNow } from 'src/utils/format-time';

import { useTransporterEwaybills } from 'src/query/use-ewaybill';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

export function EwaybillByStateWidget({ title = 'E-Waybills', ...other }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [forceRefresh, setForceRefresh] = useState(false);

  const queryClient = useQueryClient();

  const params = useMemo(
    () => ({
      generated_date: selectedDate.format('DD/MM/YYYY'),
      ...(forceRefresh && { force: true }),
    }),
    [selectedDate, forceRefresh]
  );

  const { data, isLoading, isFetching } = useTransporterEwaybills(params);

  useEffect(() => {
    if (!isFetching && forceRefresh && data) {
      const normalParams = { generated_date: selectedDate.format('DD/MM/YYYY') };
      queryClient.setQueryData(['ewaybill', 'transporter', normalParams], data);
      setForceRefresh(false);
    }
  }, [isFetching, forceRefresh, data, selectedDate, queryClient]);

  const handleSync = () => {
    setForceRefresh(true);
  };

  const list = data?.results?.message || [];
  const total = list.length || 0;

  const headLabel = [
    { id: 'index', label: 'No.' },
    { id: 'ewayBillNo', label: 'EWB No' },
    { id: 'ewayBillDate', label: 'EWB Date' },
    { id: 'documentNumber', label: 'Document No' },
    { id: 'placeOfDelivery', label: 'Place of Delivery' },
    { id: 'customer', label: 'Customer' },
    { id: 'subtrip', label: 'Subtrip' },
    { id: 'actions', label: 'Actions' },
  ];

  return (
    <Card {...other}>
      <Box
        sx={{
          px: 3,
          pt: 3,
          mb: 2,
          gap: 2,
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              mb: 0.5,
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.secondary',
              typography: 'subtitle2',
            }}
          >
            {title}
          </Box>
          <Box sx={{ typography: 'h4' }}>{total}</Box>
          {data?.fetchedAt && (
            <Box sx={{ typography: 'caption', color: 'text.disabled', mt: 0.5 }}>
              Last fetched: {fToNow(data.fetchedAt)} ago
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <DatePicker
            label="Select date"
            value={selectedDate}
            onChange={(val) => val && setSelectedDate(val)}
            disableFuture
          />
          <Tooltip title="Sync from portal" arrow>
            <IconButton
              onClick={handleSync}
              disabled={isLoading || isFetching}
              color="primary"
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
                border: (theme) => `solid 1px ${theme.palette.divider}`,
                animation: isLoading || isFetching ? 'spin 1.5s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            >
              <Iconify icon="eva:sync-outline" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Scrollbar sx={{ minHeight: 260, maxHeight: 360 }}>
        <Table size="small" sx={{ minWidth: 1040 }}>
          <TableHeadCustom headLabel={headLabel} />
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : list && list.length ? (
              <>
                {list.map((row, idx) => {
                  const customerName = row?.customer?.name || '-';
                  const subtripCreated = Boolean(row?.hasSubtrip);
                  const subtripId =
                    row?.subtripId?._id ||
                    row?.subtripId ||
                    row?.subtrip_id ||
                    row?.subtrip?._id ||
                    row?.subtrip?.id ||
                    null;
                  const ewbNo = row?.eway_bill_number || row?.ewayBillNo || row?.ewayBill || '';
                  return (
                    <TableRow key={row?.eway_bill_number || idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        {ewbNo ? (
                          <Link
                            component={RouterLink}
                            to={{
                              pathname: paths.dashboard.subtrip.jobCreate,
                              search: `?ewayBill=${encodeURIComponent(ewbNo)}`,
                            }}
                            variant="body2"
                            noWrap
                            sx={{ color: 'primary.main' }}
                          >
                            {ewbNo}
                          </Link>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{row?.eway_bill_date || '-'}</TableCell>
                      <TableCell>{row?.document_number || '-'}</TableCell>
                      <TableCell>{row?.place_of_delivery || '-'}</TableCell>
                      <TableCell>{customerName}</TableCell>
                      <TableCell>
                        <Label variant="soft" color={subtripCreated ? 'success' : 'warning'}>
                          {subtripCreated ? 'Created' : 'Not Created'}
                        </Label>
                      </TableCell>
                      <TableCell>
                        {subtripCreated ? (
                          <Tooltip title={subtripId ? 'View Job Details' : 'Job exists'} arrow>
                            <span>
                              <IconButton
                                size="small"
                                color="primary"
                                component={subtripId ? RouterLink : 'button'}
                                to={
                                  subtripId ? paths.dashboard.subtrip.details(subtripId) : undefined
                                }
                                disabled={!subtripId}
                              >
                                <Iconify icon="mdi:open-in-new" width={18} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Create Job from this eWay Bill" arrow>
                            <span>
                              <IconButton
                                size="small"
                                color="success"
                                component={RouterLink}
                                to={{
                                  pathname: paths.dashboard.subtrip.jobCreate,
                                  search: ewbNo ? `?ewayBill=${encodeURIComponent(ewbNo)}` : '',
                                }}
                              >
                                <Iconify icon="mdi:plus-circle" width={18} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <TableNoData notFound />
            )}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}

export default EwaybillByStateWidget;
