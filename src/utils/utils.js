import { CONFIG } from 'src/config-global';

// Driver Payment Section
export const calculateDriverSalaryPerSubtrip = (subtrip) => {
  if (!subtrip?.expenses || !Array.isArray(subtrip?.expenses)) {
    return 0;
  }

  // Filter expenses for driver-salary type
  const driverSalaryExpenses = subtrip?.expenses.filter(
    (expense) => expense.expenseType === 'driver-salary'
  );

  // Sum the amounts of driver-salary expenses
  const totalDriverSalary = driverSalaryExpenses.reduce(
    (accumulator, expense) => accumulator + (expense.amount || 0),
    0
  );

  return totalDriverSalary;
};

export const calculatePayslipSummary = (payslip) => {
  if (!payslip || typeof payslip !== 'object') {
    throw new Error('Invalid payslip data');
  }

  const { otherSalaryComponent = [], subtripComponents = [], selectedLoans = [] } = payslip;

  // Calculate total fixed income
  const totalFixedIncome = otherSalaryComponent
    .filter((item) => item.paymentType === 'Fixed Salary')
    .reduce((accumulator, item) => accumulator + (item.amount || 0), 0);

  // Calculate total trip-wise income
  const totalTripWiseIncome = subtripComponents.reduce(
    (accumulator, st) => accumulator + (calculateDriverSalaryPerSubtrip(st) || 0),
    0
  );

  // Calculate total deductions
  const totalDeductions = otherSalaryComponent
    .filter((item) => item.paymentType === 'Penalty Deduction')
    .reduce((accumulator, item) => accumulator + (item.amount || 0), 0);

  // calculate total repayments
  const totalRepayments = selectedLoans.reduce(
    (accumulator, { installmentAmount }) => accumulator + installmentAmount,
    0
  );

  const netSalary = totalFixedIncome + totalTripWiseIncome - totalDeductions - totalRepayments;

  return {
    totalFixedIncome,
    totalTripWiseIncome,
    totalDeductions,
    netSalary,
    totalRepayments,
  };
};

// Transporter Payment
export const calculateTransporterPayment = (subtrip) => {
  if (!subtrip.expenses || !Array.isArray(subtrip.expenses)) {
    return 0;
  }
  // Total Income of subtrip

  const transporterCommissionRate = subtrip.commissionRate || 0;

  const rateAfterCommision = subtrip.rate - transporterCommissionRate;
  const totalFreightAmount = rateAfterCommision * subtrip.loadingWeight;

  // Total Shortage Amount
  const totalShortageAmount = subtrip.shortageAmount || 0;

  // Total Expense of subtrip
  const totalExpense = subtrip?.expenses.reduce((acc, expense) => acc + expense.amount, 0);

  // transporter Payment
  const totalTransporterPayment = totalFreightAmount - totalExpense - totalShortageAmount;

  return {
    effectiveFreightRate: rateAfterCommision,
    totalFreightAmount,
    totalExpense,
    totalTransporterPayment,
    totalShortageAmount,
  };
};

export const calculateTransporterPaymentSummary = (payment) => {
  if (!payment || typeof payment !== 'object') {
    throw new Error('Invalid payment data');
  }

  const { associatedSubtrips = [], selectedLoans = [] } = payment;

  console.log({ associatedSubtrips });

  // Calculate total trip-wise income
  const totalTripWiseIncome = associatedSubtrips.reduce((accumulator, st) => {
    const { totalTransporterPayment } = calculateTransporterPayment(st);
    return accumulator + totalTransporterPayment;
  }, 0);

  const totalShortageAmount = associatedSubtrips.reduce((accumulator, st) => {
    const { totalShortageAmount: shortageAmount } = calculateTransporterPayment(st);
    return accumulator + shortageAmount;
  }, 0);

  // calculate total repayments
  const totalRepayments = selectedLoans.reduce(
    (accumulator, { installmentAmount }) => accumulator + installmentAmount,
    0
  );

  const netIncome = totalTripWiseIncome - totalRepayments - totalShortageAmount;

  return {
    totalTripWiseIncome,
    netIncome,
    totalRepayments,
    totalShortageAmount,
  };
};

// Invoice Section
export const calculateInvoicePerSubtrip = (subtrip) => {
  const freightAmount = (subtrip.rate || 0) * (subtrip.loadingWeight || 0);
  const shortageAmount = subtrip.shortageAmount || 0;
  const totalAmount = freightAmount - shortageAmount;

  return {
    freightAmount,
    shortageAmount,
    totalAmount,
  };
};

export const calculateInvoiceSummary = (invoice) => {
  if (!invoice?.invoicedSubTrips || !Array.isArray(invoice.invoicedSubTrips)) {
    throw new Error('Invalid invoice data');
  }

  const { customerInvoiceTax = 0 } = CONFIG;

  // Calculate totals for each subtrip
  const subtripTotals = invoice.invoicedSubTrips.map((subtrip) => {
    const { freightAmount, shortageAmount, totalAmount } = calculateInvoicePerSubtrip(subtrip);
    const shortageWeight = subtrip.shortageWeight || 0;

    return {
      freightAmount,
      shortageAmount,
      totalAmount,
      freightWeight: subtrip.loadingWeight || 0,
      shortageWeight,
    };
  });

  // Sum up all totals
  const totalAmountBeforeTax = subtripTotals.reduce((sum, st) => sum + st.totalAmount, 0);
  const totalFreightAmount = subtripTotals.reduce((sum, st) => sum + st.freightAmount, 0);
  const totalShortageAmount = subtripTotals.reduce((sum, st) => sum + st.shortageAmount, 0);
  const totalFreightWt = subtripTotals.reduce((sum, st) => sum + st.freightWeight, 0);
  const totalShortageWt = subtripTotals.reduce((sum, st) => sum + st.shortageWeight, 0);

  // Calculate tax and final amount
  const taxAmount = (totalAmountBeforeTax * customerInvoiceTax) / 100;
  const totalAfterTax = totalAmountBeforeTax + taxAmount;

  return {
    totalAmountBeforeTax,
    totalFreightAmount,
    totalShortageAmount,
    totalFreightWt,
    totalShortageWt,
    totalAfterTax,
  };
};

// for providing insignts while adding salary expense
export function getSalaryDetailsByVehicleType(routes, currentRouteId, vehicleType) {
  if (!routes || !Array.isArray(routes)) {
    throw new Error('Routes must be a valid array.');
  }
  if (!currentRouteId || !vehicleType) {
    throw new Error('Both currentRouteId and vehicleType parameters are required.');
  }

  // Find the selected route by its ID
  const selectedRoute = routes.find((route) => route._id === currentRouteId);

  if (!selectedRoute) {
    throw new Error(`No route found with ID: ${currentRouteId}`);
  }

  // Find the salary details for the given vehicle type
  const salaryDetails = selectedRoute.salary.find(
    (item) => item.vehicleType.toLowerCase() === vehicleType.toLowerCase()
  );

  if (!salaryDetails) {
    console.log(`No salary details found for vehicleType: ${vehicleType} in the selected route.`);
    return {};
  }

  // Return combined details
  return {
    routeName: selectedRoute.routeName,
    vehicleType: salaryDetails.vehicleType,
    fixedSalary: salaryDetails.fixedSalary,
    percentageSalary: salaryDetails.percentageSalary,
    fixMilage: salaryDetails.fixMilage,
    performanceMilage: salaryDetails.performanceMilage,
    diesel: salaryDetails.diesel,
    adBlue: salaryDetails.adBlue,
    advanceAmt: salaryDetails.advanceAmt,
    // Common route fields
    tollAmt: selectedRoute.tollAmt,
    distance: selectedRoute.distance,
    tripType: selectedRoute.tripType,
    fromPlace: selectedRoute.fromPlace,
    toPlace: selectedRoute.toPlace,
    noOfDays: selectedRoute.noOfDays,
  };
}
