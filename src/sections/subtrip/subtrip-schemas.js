import { z as zod } from 'zod';

import { schemaHelper } from 'src/components/hook-form';

import { DRIVER_ADVANCE_GIVEN_BY_OPTIONS } from './constants';

const preprocessOptionalNumber = (schema) =>
  zod
    .union([zod.number(), zod.string(), zod.null(), zod.undefined()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return Number.isNaN(num) ? undefined : num;
    })
    .pipe(schema);

export const receiveSchema = zod
  .object({
    subtripId: zod.string().min(1, { message: 'Job is required' }),
    unloadingWeight: preprocessOptionalNumber(zod.number({ required_error: 'Unloading weight is required' })),
    endDate: schemaHelper.date({ message: { required_error: 'End date is required!' } }),
    commissionDetails: zod
      .object({
        commissionRate: preprocessOptionalNumber(zod.number().min(0, { message: 'Commission rate cannot be negative' }).optional()),
        commissionAmount: preprocessOptionalNumber(zod.number().min(0, { message: 'Commission amount cannot be negative' }).optional()),
      })
      .optional(),
    freightDetails: zod
      .object({
        freightAmount: preprocessOptionalNumber(zod.number().optional()),
        endKm: preprocessOptionalNumber(zod.number().optional()),
        endTime: schemaHelper.dateOptional({ message: { invalid_type_error: 'Invalid End Time!' } }),
      })
      .optional(),
    hasError: zod.boolean().optional(),
    remarks: zod.string().optional(),
    shortageWeight: preprocessOptionalNumber(zod.number().optional()),
    shortageAmount: preprocessOptionalNumber(zod.number().optional()),
    hasShortage: zod.boolean().optional(),
    docs: zod.array(zod.any()).max(5, { message: 'Maximum 5 documents allowed' }).optional(),

    // Required for validation [not the actual fields]
  })
  .superRefine((values, ctx) => {
    // if (values.loadingWeight && values.unloadingWeight > values.loadingWeight) {
    //   ctx.addIssue({
    //     code: zod.ZodIssueCode.custom,
    //     message: 'Unloading weight must be ≤ loading weight',
    //     path: ['unloadingWeight'],
    //   });
    // }

    // if (values.startKm && values.endKm && values.endKm < values.startKm) {
    //   ctx.addIssue({
    //     code: zod.ZodIssueCode.custom,
    //     message: 'End Km must be ≥ Start Km',
    //     path: ['endKm'],
    //   });
    // }

    // if (
    //   values.commissionRate !== undefined &&
    //   values.rate !== undefined &&
    //   values.commissionRate > values.rate
    // ) {
    //   ctx.addIssue({
    //     code: zod.ZodIssueCode.custom,
    //     message: 'Commission rate cannot be more than the rate',
    //     path: ['commissionRate'],
    //   });
    // }

    if (values.hasShortage && (!values.shortageWeight || !values.shortageAmount)) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'Provide shortage details',
        path: ['shortageWeight'],
      });
    }

    if (values.hasError && !values.remarks) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'Remarks are required when error is reported',
        path: ['remarks'],
      });
    }
  });

// ----------------------------------------------------------------------
// Job Create Schemas & Defaults
// ----------------------------------------------------------------------

const toNumber = (val) => {
  if (val === null || val === undefined || val === '') return undefined;
  const n = Number(val);
  return Number.isFinite(n) ? n : undefined;
};

// Accept number-like values; coerce to number; treat empty/NaN as undefined
const numericInputSchema = zod.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  const n = typeof val === 'number' ? val : Number(val);
  return Number.isFinite(n) ? n : undefined;
}, zod.number().optional());

// Loading weight: 0 to 60 inclusive
const loadingWeightSchema = zod.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  const n = typeof val === 'number' ? val : Number(val);
  return Number.isFinite(n) ? n : undefined;
}, zod
  .number()
  .min(0, { message: 'Loading weight must be at least 0' })
  .max(60, { message: 'Loading weight must be at most 60' })
  .optional());

const consigneeOptionSchema = zod
  .object({ label: zod.string().optional(), value: zod.string().optional() })
  .partial()
  .nullish();

export const jobCreateSchema = zod
  .object({
    diNumber: zod.string().optional(),
    remarks: zod.string().optional(),
    startDate: schemaHelper.date({
      message: {
        required_error: 'Start date is required!',
        invalid_type_error: 'Invalid Start Date!',
      },
    }),
    tripDecision: zod.enum(['attach', 'new']),
    tripId: zod.string().optional(),
    loadType: zod.enum(['loaded', 'empty']),
    startKm: numericInputSchema,
    consignee: consigneeOptionSchema,
    loadingPoint: zod.string().optional(),
    unloadingPoint: zod.string().optional(),
    loadingWeight: loadingWeightSchema,
    freightModel: zod.enum(['per_ton', 'fixed', 'per_km', 'per_hour', 'hybrid']).optional(),
    freightAmount: numericInputSchema,
    baseKm: numericInputSchema,
    rate: numericInputSchema,
    freightStartKm: numericInputSchema,
    invoiceNo: zod.string().optional(),
    ewayBill: zod.string().optional(),
    // Optional because empty subtrips won't have it
    ewayExpiryDate: schemaHelper.dateOptional({
      message: { invalid_type_error: 'Invalid Eway Expiry Date!' },
    }),
    materialType: zod.string().optional(),
    quantity: numericInputSchema,
    grade: zod.string().optional(),
    shipmentNo: zod.string().optional(),
    orderNo: zod.string().optional(),
    referenceSubtripNo: zod.string().optional(),
    driverAdvance: numericInputSchema,
    driverAdvanceGivenBy: zod.string().optional(),
    initialAdvanceDiesel: numericInputSchema,
    initialAdvanceDieselUnit: zod.enum(['litre', 'amount']).optional(),
    pumpCd: zod.string().optional(),
  })
  .superRefine((data, ctx) => {
    const dieselAdvance = toNumber(data.initialAdvanceDiesel);
    const requiresPump =
      data.driverAdvanceGivenBy === DRIVER_ADVANCE_GIVEN_BY_OPTIONS.FUEL_PUMP ||
      (dieselAdvance !== undefined && dieselAdvance > 0);

    if (requiresPump && !data.pumpCd) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'Pump selection is required when advance or diesel is provided by the pump',
        path: ['pumpCd'],
      });
    }
  });

export const createJobDefaultValues = () => ({
  diNumber: '',
  remarks: '',
  startDate: new Date(),
  tripDecision: 'attach',
  loadType: 'loaded',
  startKm: '',
  consignee: null,
  loadingPoint: '',
  unloadingPoint: '',
  loadingWeight: '',
  freightModel: 'per_ton',
  freightAmount: '',
  baseKm: '',
  rate: '',
  freightStartKm: '',
  invoiceNo: '',
  ewayBill: '',
  ewayExpiryDate: null,
  materialType: '',
  quantity: '',
  grade: '',
  shipmentNo: '',
  orderNo: '',
  referenceSubtripNo: '',
  driverAdvance: '',
  driverAdvanceGivenBy: DRIVER_ADVANCE_GIVEN_BY_OPTIONS.SELF,
  initialAdvanceDiesel: '',
  initialAdvanceDieselUnit: 'litre',
  pumpCd: '',
});

