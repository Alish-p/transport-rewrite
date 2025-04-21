import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { useMemo, useState, useContext, useCallback, createContext } from 'react';

import { paths } from 'src/routes/paths';

import { useCreateInvoice } from 'src/query/use-invoice';
import { useClosedTripsByCustomerAndDate } from 'src/query/use-subtrip';

import { useInvoiceValidation } from './useInvoiceValidation';

// Create the context
const InvoiceContext = createContext(null);

// Custom hook to use the invoice context
export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

// Provider component
export function InvoiceProvider({ children, customerList, existingInvoice }) {
  const navigate = useNavigate();
  const addInvoice = useCreateInvoice();

  // State for form values
  const [formState, setFormState] = useState(
    existingInvoice
      ? {
          customerId: existingInvoice.customerId?._id || '',
          createdDate: existingInvoice.createdDate || dayjs(),
          fromDate: existingInvoice.fromDate || dayjs().startOf('month'),
          toDate: existingInvoice.toDate || dayjs(),
          dueDate: existingInvoice.dueDate || dayjs().add(1, 'month'),
          invoicedSubTrips: existingInvoice.invoicedSubTrips?.map((st) => st._id) || [],
        }
      : {
          customerId: '',
          createdDate: dayjs(),
          fromDate: dayjs().startOf('month'),
          toDate: dayjs(),
          dueDate: dayjs().add(1, 'month'),
          invoicedSubTrips: [],
        }
  );

  // Get data from the state
  const { customerId, fromDate, toDate, invoicedSubTrips, createdDate, dueDate } = formState;

  // Fetch subtrips based on customer and date range
  const { data: allSubTripsByCustomer, refetch } = useClosedTripsByCustomerAndDate(
    customerId,
    fromDate,
    toDate
  );

  // Update form state
  const updateFormState = useCallback((updates) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Fetch subtrips
  const fetchSubtrips = useCallback(() => {
    if (customerId && fromDate && toDate) {
      refetch();
    }
  }, [customerId, fromDate, toDate, refetch]);

  // Create draft invoice for preview
  const draftInvoice = useMemo(() => {
    if (existingInvoice) {
      return existingInvoice;
    }

    const selectedCustomer = customerList?.find((customer) => customer._id === customerId);
    return {
      invoicedSubTrips: allSubTripsByCustomer?.filter((st) => invoicedSubTrips.includes(st._id)),
      customerId: selectedCustomer
        ? {
            _id: selectedCustomer._id,
            customerName: selectedCustomer.customerName,
            address: selectedCustomer.address,
            cellNo: selectedCustomer.cellNo,
          }
        : { _id: '', customerName: '', address: '', cellNo: '' },
      invoiceStatus: 'draft',
      createdDate: createdDate || new Date(),
      dueDate: dueDate || null,
    };
  }, [
    customerId,
    allSubTripsByCustomer,
    customerList,
    createdDate,
    dueDate,
    invoicedSubTrips,
    existingInvoice,
  ]);

  // Validate form
  const { errors, isValid } = useInvoiceValidation(formState);

  // Create invoice
  const createInvoice = useCallback(async () => {
    if (!isValid) {
      return;
    }

    try {
      const invoiceData = {
        ...formState,
        invoiceStatus: 'pending',
      };
      const createdInvoice = await addInvoice(invoiceData);
      navigate(paths.dashboard.invoice.details(createdInvoice._id));
    } catch (error) {
      console.error('Error:', error);
    }
  }, [formState, addInvoice, navigate, isValid]);

  // Context value
  const value = useMemo(
    () => ({
      formState,
      updateFormState,
      fetchSubtrips,
      draftInvoice,
      createInvoice,
      allSubTripsByCustomer,
      errors,
      isValid,
      customerList,
      isExistingInvoice: !!existingInvoice,
    }),
    [
      formState,
      updateFormState,
      fetchSubtrips,
      draftInvoice,
      createInvoice,
      allSubTripsByCustomer,
      errors,
      isValid,
      customerList,
      existingInvoice,
    ]
  );

  return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>;
}
