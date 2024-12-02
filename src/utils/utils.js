/**
 * Calculates the total driver salary from a single subtrip's expenses.
 *
 * @param {Object} subtrip - The subtrip object containing expenses.
 * @returns {number} - The total driver salary for the subtrip.
 */
export const calculateDriverSalary = (subtrip) => {
  if (!subtrip.expenses || !Array.isArray(subtrip.expenses)) {
    return 0;
  }

  // Filter expenses for driver-salary type
  const driverSalaryExpenses = subtrip.expenses.filter(
    (expense) => expense.expenseType === 'driver-salary'
  );

  // Sum the amounts of driver-salary expenses
  const totalDriverSalary = driverSalaryExpenses.reduce(
    (accumulator, expense) => accumulator + (expense.amount || 0),
    0
  );

  return totalDriverSalary;
};

/**
 * Get salary and route details based on vehicle type
 *
 * @param {Object} route - The route information object
 * @param {String} vehicleType - The vehicle type to fetch details for
 * @returns {Object} - Object containing salary details and common route fields
 */
export function getSalaryDetailsByVehicleType(route, vehicleType) {
  if (!route || !vehicleType) {
    throw new Error('Both route and vehicleType parameters are required.');
  }

  // Find the salary details for the given vehicleType
  const salaryDetails = route.salary.find(
    (item) => item.vehicleType.toLowerCase() === vehicleType.toLowerCase()
  );

  if (!salaryDetails) {
    throw new Error(`No salary details found for vehicleType: ${vehicleType}`);
  }

  // Return combined details
  return {
    vehicleType: salaryDetails.vehicleType,
    fixedSalary: salaryDetails.fixedSalary,
    percentageSalary: salaryDetails.percentageSalary,
    fixMilage: salaryDetails.fixMilage,
    performanceMilage: salaryDetails.performanceMilage,
    diesel: salaryDetails.diesel,
    adBlue: salaryDetails.adBlue,
    advanceAmt: salaryDetails.advanceAmt,
    // Common route fields
    tollAmt: route.tollAmt,
    distance: route.distance,
    tripType: route.tripType,
    fromPlace: route.fromPlace,
    toPlace: route.toPlace,
    noOfDays: route.noOfDays,
  };
}
