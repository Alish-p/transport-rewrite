import { z as zod } from 'zod';

import { schemaHelper } from 'src/components/hook-form';

export const SubtripExpenseSchema = zod
  .object({
    date: schemaHelper.date({ message: { required_error: 'Date is required!' } }),
    expenseType: zod.string({ required_error: 'Expense Type is required' }),
    subtripId: zod.string({ required_error: 'Subtrip is required' }),
    amount: zod.number().min(1, { message: 'Amount must be a positive number' }),
    pumpCd: zod.string().optional(),
    dieselLtr: zod.number().optional(),
    dieselPrice: zod.number().optional(),
    remarks: zod.string().optional(),
    paidThrough: zod.string().optional(),
    fixedSalary: zod.number().optional(),
    variableSalary: zod.number().optional(),
    performanceSalary: zod.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.expenseType === 'diesel') {
      if (!data.pumpCd) {
        ctx.addIssue({ path: ['pumpCd'], message: 'Pump Code is required for Diesel expenses' });
      }
      if (!data.dieselLtr || data.dieselLtr <= 0) {
        ctx.addIssue({ path: ['dieselLtr'], message: 'Diesel Liters must be a positive Number' });
      }
      if (!data.dieselPrice || data.dieselPrice <= 0) {
        ctx.addIssue({ path: ['dieselPrice'], message: 'Per Litre Diesel Price must be positive' });
      }
    }
  });
