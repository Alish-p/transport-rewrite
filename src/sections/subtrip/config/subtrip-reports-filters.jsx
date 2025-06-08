import { fDateRangeShortLabel } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import { SUBTRIP_STATUS } from 'src/sections/subtrip/constants';

export const DEFAULT_FILTERS = {
  customerId: '',
  subtripId: '',
  vehicleNo: '',
  transportName: '',
  startFromDate: null,
  startEndDate: null,
  ewayExpiryFromDate: null,
  ewayExpiryEndDate: null,
  subtripEndFromDate: null,
  subtripEndEndDate: null,
  status: [],
  materials: [],
  driverId: '',
};

export const FILTER_CONFIG = [
  {
    id: 'status',
    type: 'multi-select',
    label: 'Status',
    options: Object.values(SUBTRIP_STATUS),
    icon: 'mdi:filter-variant',
    isSelected: (f) => f.status && f.status.length > 0,
    mapToParam: 'subtripStatus',
    getValue: (f) => f.status,
  },
  {
    id: 'materials',
    type: 'multi-select',
    label: 'Materials',
    options: Object.values(CONFIG.materialOptions),
    icon: 'mdi:filter-variant',
    isSelected: (f) => f.materials && f.materials.length > 0,
    mapToParam: 'materials',
    getValue: (f) => f.materials,
  },
  {
    id: 'startDateRange',
    type: 'date-range',
    label: 'Dispatch Date Range',
    startKey: 'startFromDate',
    endKey: 'startEndDate',
    icon: 'mdi:calendar',
    isSelected: (f) => f.startFromDate && f.startEndDate,
    getLabel: (f) => fDateRangeShortLabel(f.startFromDate, f.startEndDate),
    mapToParam: ['fromDate', 'toDate'],
    getValue: (f) => [f.startFromDate, f.startEndDate],
    onDelete: (onFilters) => {
      onFilters('startFromDate', null);
      onFilters('startEndDate', null);
    },
  },
  {
    id: 'ewayDateRange',
    type: 'date-range',
    label: 'E-way Expiry Range',
    startKey: 'ewayExpiryFromDate',
    endKey: 'ewayExpiryEndDate',
    icon: 'mdi:calendar',
    isSelected: (f) => f.ewayExpiryFromDate && f.ewayExpiryEndDate,
    getLabel: (f) => fDateRangeShortLabel(f.ewayExpiryFromDate, f.ewayExpiryEndDate),
    mapToParam: ['ewayExpiryFromDate', 'ewayExpiryToDate'],
    getValue: (f) => [f.ewayExpiryFromDate, f.ewayExpiryEndDate],
    onDelete: (onFilters) => {
      onFilters('ewayExpiryFromDate', null);
      onFilters('ewayExpiryEndDate', null);
    },
  },
  {
    id: 'endDateRange',
    type: 'date-range',
    label: 'Received Date Range',
    startKey: 'subtripEndFromDate',
    endKey: 'subtripEndEndDate',
    icon: 'mdi:calendar',
    isSelected: (f) => f.subtripEndFromDate && f.subtripEndEndDate,
    getLabel: (f) => fDateRangeShortLabel(f.subtripEndFromDate, f.subtripEndEndDate),
    mapToParam: ['subtripEndFromDate', 'subtripEndToDate'],
    getValue: (f) => [f.subtripEndFromDate, f.subtripEndEndDate],
    onDelete: (onFilters) => {
      onFilters('subtripEndFromDate', null);
      onFilters('subtripEndEndDate', null);
    },
  },
  {
    id: 'customerId',
    type: 'entity',
    label: 'Customer',
    icon: 'mdi:office-building',
    dialog: 'customer',
    isSelected: (f) => !!f.customerId,
    mapToParam: 'customerId',
  },
  {
    id: 'transportName',
    type: 'entity',
    label: 'Transporter',
    icon: 'mdi:truck-delivery',
    dialog: 'transporter',
    isSelected: (f) => !!f.transportName,
    mapToParam: 'transporterId',
  },
  {
    id: 'vehicleNo',
    type: 'entity',
    label: 'Vehicle',
    icon: 'mdi:truck',
    dialog: 'vehicle',
    isSelected: (f) => !!f.vehicleNo,
    mapToParam: 'vehicleId',
  },
  {
    id: 'driverId',
    type: 'entity',
    label: 'Driver',
    icon: 'mdi:account',
    dialog: 'driver',
    isSelected: (f) => !!f.driverId,
    mapToParam: 'driverId',
  },
  {
    id: 'subtripId',
    type: 'text',
    label: 'Subtrip ID',
    isSelected: (f) => !!f.subtripId,
    mapToParam: 'subtripId',
  },
];

export const isAnyFilterApplied = (filters) =>
  FILTER_CONFIG.some((config) => config.isSelected?.(filters));
