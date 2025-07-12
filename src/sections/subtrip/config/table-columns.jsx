import { ListItemText } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate, fTime, fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

import { SUBTRIP_STATUS_COLORS } from '../constants';

export const TABLE_COLUMNS = [
  {
    id: '_id',
    label: 'LR No',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row?._id,
    align: 'center',
    render: ({ _id }) => (
      <RouterLink
        to={`${paths.dashboard.subtrip.details(_id)}`}
        style={{ color: 'green', textDecoration: 'underline' }}
      >
        <ListItemText
          primary={_id}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </RouterLink>
    ),
  },
  {
    id: 'tripId',
    label: 'Trip No',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.tripId?._id,
    align: 'center',
    render: (row) => {
      const value = row?.tripId?._id || '-';
      return (
        <RouterLink
          to={`${paths.dashboard.trip.details(value)}`}
          style={{ color: 'green', textDecoration: 'underline' }}
        >
          <ListItemText
            primary={value}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </RouterLink>
      );
    },
  },
  {
    id: 'vehicleNo',
    label: 'Vehicle No',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row?.tripId?.vehicleId?.vehicleNo || '-',
    align: 'center',
  },
  {
    id: 'driver',
    label: 'Driver',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.tripId?.driverId?.driverName || '-',
    align: 'center',
  },
  {
    id: 'customerId',
    label: 'Customer',
    defaultVisible: true,
    disabled: true,
    getter: (row) => row?.customerId?.customerName || '-',
    align: 'center',
  },
  {
    id: 'routeName',
    label: 'Route',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row?.routeCd?.routeName || '-',
    align: 'center',
  },
  {
    id: 'invoiceNo',
    label: 'Invoice No',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.invoiceNo || '-',
    align: 'center',
  },
  {
    id: 'shipmentNo',
    label: 'Shipment No',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.shipmentNo || '-',
    align: 'center',
  },
  {
    id: 'orderNo',
    label: 'Order No',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.orderNo || '-',
  },
  {
    id: 'consignee',
    label: 'Consignee',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.consignee || '-',
    align: 'center',
  },
  {
    id: 'materialType',
    label: 'Material',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.materialType || '-',
    align: 'center',
  },
  {
    id: 'quantity',
    label: 'Quantity',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.quantity || '-',
    align: 'center',
    showTotal: true,
  },
  {
    id: 'grade',
    label: 'Grade',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.grade || '-',
    align: 'center',
  },
  {
    id: 'startDate',
    label: 'Dispatch Date',
    defaultVisible: true,
    disabled: false,
    getter: (row) => fDateTime(row?.startDate) || '-',
    type: 'date',
    align: 'center',
    render: ({ startDate }) => (
      <ListItemText
        primary={fDate(new Date(startDate))}
        secondary={fTime(new Date(startDate))}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{
          mt: 0.5,
          component: 'span',
          typography: 'caption',
        }}
      />
    ),
  },
  {
    id: 'endDate',
    label: 'Received Date',
    defaultVisible: false,
    disabled: false,
    getter: (row) => fDate(row?.endDate) || '-',
    type: 'date',
    align: 'center',
    render: (row) => (
      <ListItemText
        primary={row?.endDate ? fDate(new Date(row?.endDate)) : '-'}
        secondary={row?.endDate ? fTime(new Date(row?.endDate)) : '-'}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{
          mt: 0.5,
          component: 'span',
          typography: 'caption',
        }}
      />
    ),
  },
  {
    id: 'ewayExpiryDate',
    label: 'E-Way Bill Expiry Date',
    defaultVisible: false,
    disabled: false,
    getter: (row) => fDate(row?.ewayExpiryDate) || '-',
    type: 'date',
    align: 'center',
    render: (row) => (
      <ListItemText
        primary={row?.ewayExpiryDate ? fDate(new Date(row?.ewayExpiryDate)) : '-'}
        secondary={row?.ewayExpiryDate ? fTime(new Date(row?.ewayExpiryDate)) : '-'}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{
          mt: 0.5,
          component: 'span',
          typography: 'caption',
        }}
      />
    ),
  },
  {
    id: 'loadingPoint',
    label: 'Loading Point',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.loadingPoint || '-',
  },
  {
    id: 'unloadingPoint',
    label: 'Unloading Point',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.unloadingPoint || '-',
    align: 'center',
  },
  {
    id: 'loadingWeight',
    label: 'Loading Weight',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.loadingWeight || '-',
    align: 'center',
    showTotal: true,
  },
  {
    id: 'unloadingWeight',
    label: 'Unloading Weight',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.unloadingWeight || '-',
    align: 'center',
    showTotal: true,
  },
  {
    id: 'shortageWeight',
    label: 'Shortage (Weight)',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.shortageWeight || '-',
    align: 'center',
    showTotal: true,
  },
  {
    id: 'shortageAmount',
    label: 'Shortage (₹)',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.shortageAmount || '-',
    align: 'center',
    showTotal: true,
  },
  {
    id: 'rate',
    label: 'Rate',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.rate || '-',
    align: 'center',
  },
  {
    id: 'freightAmount',
    label: 'Freight Amount',
    defaultVisible: false,
    disabled: false,
    getter: (row) => {
      if (typeof row?.freightAmount === 'number') {
        return row.freightAmount;
      }
      if (row?.rate && row?.loadingWeight) {
        return row.rate * row.loadingWeight;
      }
      return '-';
    },
    align: 'center',
    showTotal: true,
  },
  {
    id: 'commissionRate',
    label: 'Commission Rate',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.commissionRate || '-',
    align: 'center',
  },
  {
    id: 'transport',
    label: 'Transporter',
    defaultVisible: false,
    disabled: false,
    getter: (row) => row?.tripId?.vehicleId?.transporter?.transportName || '-',
    align: 'center',
  },
  {
    id: 'subtripStatus',
    label: 'Subtrip Status',
    defaultVisible: true,
    disabled: false,
    getter: (row) => row?.subtripStatus || '-',
    align: 'center',
    render: (row) => {
      const value = row?.subtripStatus || '-';
      return (
        <Label variant="soft" color={SUBTRIP_STATUS_COLORS[value] || 'default'}>
          {value}
        </Label>
      );
    },
  },
];
