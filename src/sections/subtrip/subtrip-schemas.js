import { z as zod } from 'zod';

import { schemaHelper } from 'src/components/hook-form';

export const receiveSchema = zod
  .object({
    subtripId: zod.string().min(1, { message: 'Subtrip is required' }),
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
