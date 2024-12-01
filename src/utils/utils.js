export const calculateDriverSalary = (subtrip, vehicleType) => {
  const { fixedSalary, percentageSalary } = subtrip.routeCd.salary[0];
  const comission = subtrip.rate * subtrip.loadingWeight * 0.95 * percentageSalary * 0.01;
  return comission + fixedSalary;
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
