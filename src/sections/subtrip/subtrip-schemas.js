import { z as zod } from 'zod';

import { schemaHelper } from 'src/components/hook-form';

export const receiveSchema = zod
  .object({
    subtripId: zod.string(),
    unloadingWeight: zod.number({ required_error: 'Unloading weight is required' }),
    loadingWeight: zod.number({ required_error: 'Loading weight is required' }),
    startKm: zod.number().optional(),
    endKm: zod.number({ required_error: 'End Km is required' }).optional(),
    endDate: schemaHelper.date({ message: { required_error: 'End date is required!' } }),
    commissionRate: zod
      .number()
      .min(0, { message: 'Commission rate cannot be negative' })
      .optional(),
    hasError: zod.boolean().optional(),
    remarks: zod.string().optional(),
    shortageWeight: zod.number().optional(),
    shortageAmount: zod.number().optional(),
    hasShortage: zod.boolean().optional(),
    invoiceNo: zod.string().optional(),
    rate: zod.number().optional(),
    effectiveRate: zod.number().optional(),
    shipmentNo: zod.string().optional(),
    consignee: zod.string().optional(),
    orderNo: zod.string().optional(),
    materialType: zod.string().optional(),
    quantity: zod.number().optional(),
    grade: zod.string().optional(),
    diNumber: zod.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.loadingWeight && values.unloadingWeight > values.loadingWeight) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'Unloading weight must be ≤ loading weight',
        path: ['unloadingWeight'],
      });
    }

    if (values.startKm && values.endKm && values.endKm < values.startKm) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'End Km must be ≥ Start Km',
        path: ['endKm'],
      });
    }

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
