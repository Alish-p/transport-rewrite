import { useMemo } from 'react';

import { fIsAfter } from 'src/utils/format-time';

export const useInvoiceValidation = (formState) => {
  const { customerId, fromDate, toDate, invoicedSubTrips } = formState;

  const errors = useMemo(() => {
    const validationErrors = {};

    // Validate customer selection
    if (!customerId) {
      validationErrors.customerId = 'Customer is required';
    }

    // Validate date range
    if (!fromDate) {
      validationErrors.fromDate = 'From date is required';
    }

    if (!toDate) {
      validationErrors.toDate = 'To date is required';
    }

    if (fromDate && toDate && fIsAfter(fromDate, toDate)) {
      validationErrors.toDate = 'To-date cannot be earlier than From date!';
    }

    // Validate subtrips selection
    if (!invoicedSubTrips || invoicedSubTrips.length === 0) {
      validationErrors.invoicedSubTrips = 'At least one subtrip must be selected';
    }

    return validationErrors;
  }, [customerId, fromDate, toDate, invoicedSubTrips]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  return { errors, isValid };
};
