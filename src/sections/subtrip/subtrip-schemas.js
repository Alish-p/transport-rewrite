import { z as zod } from 'zod';

import { schemaHelper } from 'src/components/hook-form';

export const receiveSchema = zod
  .object({
    subtripId: zod.string(),
    unloadingWeight: zod.number({ required_error: 'Unloading weight is required' }),
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
    // Validate unloadingWeight <= loadingWeight if loadingWeight is available
    if (values.loadingWeight && values.unloadingWeight > values.loadingWeight) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'Unloading weight must be less than or equal to loading weight',
        path: ['unloadingWeight'],
      });
    }

    // Validate endKm >= startKm if both are available
    if (values.startKm && values.endKm && values.endKm < values.startKm) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'End Km must be greater than or equal to Start Km',
        path: ['endKm'],
      });
    }
  });
