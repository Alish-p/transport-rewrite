import { z as zod } from 'zod';

import { schemaHelper } from 'src/components/hook-form';

export const SUBTRIP_STATUS = {
  IN_QUEUE: 'in-queue',
  LOADED: 'loaded',
  RECEIVED: 'received',
  ERROR: 'error',
  CLOSED: 'closed',
  BILLED: 'billed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const SUBTRIP_STATUS_COLORS = {
  'in-queue': 'warning',
  loaded: 'info',
  received: 'info',
  error: 'error',
  closed: 'secondary',
  billed: 'primary',
  completed: 'success',
  cancelled: 'error',
};

// Schema for In-queue status (only in-queue fields are required)
export const inQueueSchema = zod.object({
  customerId: zod.string().min(1, { message: 'Customer ID is required' }),
  diNumber: zod.string(),
  startDate: schemaHelper.date({ message: { required_error: 'Start date is required!' } }),
});

// Schema for Loaded status (includes In-queue + loaded fields)
export const loadedSchema = inQueueSchema.extend({
  consignee: zod
    .any()
    .nullable()
    .refine((val) => val !== null, { message: 'Consignee is required' }),
  loadingWeight: zod.number({ required_error: 'Loading Weight is required' }).positive().int(),
  startKm: zod.number({ required_error: 'Start Km is required' }).positive().int(),
  rate: zod.number({ required_error: 'Rate is required' }).positive().int(),
  invoiceNo: zod.string().optional(),
  shipmentNo: zod.string().optional(),
  orderNo: zod.string().optional(),
  ewayBill: zod.string().optional(),
  ewayExpiryDate: schemaHelper.date({
    message: { required_error: 'Eway Expiry date is required!' },
  }),
  materialType: zod.string().optional(),
  quantity: zod.number({ required_error: 'Quantity is required' }).positive().int(),
  grade: zod.string().optional(),
  tds: zod.number().int().optional(),
  routeCd: zod.string().min(1, { message: 'Route Code is required' }),
  loadingPoint: zod.string().min(1, { message: 'Loading Point is required' }),
  unloadingPoint: zod.string().min(1, { message: 'Unloading Point is required' }),
});

// Schema for Received status (includes In-queue + Loaded + receive fields)
export const receivedSchema = loadedSchema.extend({
  remarks: zod.string().optional(),
  unloadingWeight: zod.number({ required_error: 'Unloading weight is required' }),
  deductedWeight: zod
    .number({ required_error: 'Deducted weight is required' })
    .min(0, { message: 'Deducted weight cannot be negative' }),
  deductedAmount: zod.number().min(0, { message: 'Deducted amount cannot be negative' }),
  endKm: zod.number({ required_error: 'End Km is required' }),
  totalKm: zod
    .number()
    .min(0, { message: 'Total Km must be zero or a positive number' })
    .optional(),
  endDate: schemaHelper.date({ message: { required_error: 'End date is required!' } }),
});
