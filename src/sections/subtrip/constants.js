import { z as zod } from 'zod';

import { schemaHelper } from 'src/components/hook-form';

export const SUBTRIP_STATUS_COLORS = {
  'in-queue': 'warning',
  loaded: 'info',
  received: 'primary',
  error: 'error',
  closed: 'secondary',
  'billed-pending': 'warning',
  'billed-overdue': 'error',
  'billed-paid': 'success',
};

export const SUBTRIP_STATUS = {
  IN_QUEUE: 'in-queue', // When the consignment is created and assigned a vehicle, waiting for loading
  LOADED: 'loaded', // When the vehicle is fully loaded and has left for delivery
  ERROR: 'error', // When there is a problem with documents or other issues
  RECEIVED: 'received', // When the consignment is successfully received at the destination
  // CLOSED: 'closed', // When all details are verified and the subtrip is officially completed
  BILLED_PENDING: 'billed-pending', // When the invoice is generated but pending payment
  BILLED_OVERDUE: 'billed-overdue', // When the invoice is overdue and not yet paid
  BILLED_PAID: 'billed-paid', // When the invoice is fully paid
};

export const DRIVER_ADVANCE_GIVEN_BY_OPTIONS = {
  SELF: 'Self',
  FUEL_PUMP: 'Fuel Pump',
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
