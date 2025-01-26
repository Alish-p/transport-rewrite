import { CONFIG } from 'src/config-global';

/**
 * Calculates the total driver salary from a single subtrip's expenses.
 *
 * @param {Object} subtrip - The subtrip object containing expenses.
 * @returns {number} - The total driver salary for the subtrip.
 */
export const calculateDriverSalary = (subtrip) => {
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

  const { otherSalaryComponent = [], subtripComponents = [] } = payslip;

  // Calculate total fixed income
  const totalFixedIncome = otherSalaryComponent
    .filter((item) => item.paymentType === 'Fixed Salary')
    .reduce((accumulator, item) => accumulator + (item.amount || 0), 0);

  // Calculate total trip-wise income
  const totalTripWiseIncome = subtripComponents.reduce(
    (accumulator, st) => accumulator + (calculateDriverSalary(st) || 0),
    0
  );

  // Calculate total deductions
  const totalDeductions = otherSalaryComponent
    .filter((item) => item.paymentType === 'Penalty Deduction')
    .reduce((accumulator, item) => accumulator + (item.amount || 0), 0);

  const netSalary = totalFixedIncome + totalTripWiseIncome - totalDeductions;

  return {
    totalFixedIncome,
    totalTripWiseIncome,
    totalDeductions,
    netSalary,
  };
};

/**
 * Calculates the total Transporter Payment from a single subtrip's data.
 *
 * @param {Object} subtrip - The subtrip object containing expenses.
 * @returns {number} - The total Transporter Payment for the subtrip.
 */
export const calculateTransporterPayment = (subtrip) => {
  if (!subtrip.expenses || !Array.isArray(subtrip.expenses)) {
    return 0;
  }

  // Total Income of subtrip
  const rateAfterCommision = subtrip.rate - CONFIG.company.transporterCommissionRate;
  const totalFreightAmount = rateAfterCommision * subtrip.loadingWeight;

  // Total Expense of subtrip
  const totalExpense = subtrip?.expenses.reduce((acc, expense) => acc + expense.amount, 0);

  // transporter Payment
  return totalFreightAmount - totalExpense;
};

export const calculateSubtripTotalIncome = (subtrips) =>
  subtrips?.reduce((acc, trip) => acc + trip.rate * trip.loadingWeight, 0);

/**
 * Get salary and route details based on vehicle type
 *
 * @param {Array} routes - The routes array
 * @param {Object} currentRouteId - The route id
 * @param {String} vehicleType - The vehicle type to fetch details for
 * @returns {Object} - Object containing salary details and common route fields
 */
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
