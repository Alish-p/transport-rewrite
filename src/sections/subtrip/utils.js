import { DEFAULT_SUBTRIP_EXPENSE_TYPES } from '../expense/expense-config';

export const mapExpensesToChartData = (expenses, expenseTypes = DEFAULT_SUBTRIP_EXPENSE_TYPES) => {
  const expenseData = expenseTypes.map((type) => {
    const total = expenses
      .filter((expense) => expense.expenseType === type.value)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return { label: type.label, value: total };
  });

  return expenseData;
};

/**
 * Generate insights comparing actual subtrip data (expenses, distance, etc.)
 * against the expected or standard data from the route definition.
 *
 * @param {Object} subtrip - The complete subtrip object, populated with:
 *   - routeCd
 *   - expenses
 *   - vehicleId
 * @returns {Array} An array of insight objects (each with a `type` and `message`).
 */
export function generateInsightsForSubtrip(subtrip) {
  const insights = [];

  // 1. Safety checks
  if (!subtrip.routeCd || !subtrip.vehicleId) {
    // If we lack route data or vehicle data, we cannot compare expected vs actual
    return insights; // Return an empty array
  }

  const { routeCd, expenses, startKm, endKm } = subtrip;
  const vehicleType = subtrip.vehicleId.vehicleType
    ? subtrip.vehicleId.vehicleType.toLowerCase()
    : 'body'; // default to "body" or handle gracefully

  // 2. Find the route config for this vehicle type
  //    (because routeCd.salary is an array of different vehicle configs)
  let routeVehicleData = routeCd.salary?.find((s) => s.vehicleType.toLowerCase() === vehicleType);
  // Fallback if not found:
  if (!routeVehicleData) {
    routeVehicleData = {
      fixedSalary: 0,
      diesel: 0,
      adBlue: 0,
      advanceAmt: 0,
      // any other defaults
    };
  }

  // 3. Diesel Usage Check
  //    a) Sum up actual diesel liters from subtrip expenses
  const totalDieselLiters = expenses
    .filter((e) => e.expenseType === 'diesel')
    .reduce((sum, e) => sum + (e.dieselLtr || 0), 0);

  //    b) Compare with the route's expected "diesel" field for that vehicle type
  const expectedDiesel = routeVehicleData.diesel || 0;
  const dieselDiff = totalDieselLiters - expectedDiesel;

  if (dieselDiff > 0) {
    insights.push({
      type: 'fuel-overuse',
      message: `Used ${dieselDiff} liters more diesel than expected (${expectedDiesel} vs. ${totalDieselLiters}).`,
    });
  } else if (dieselDiff < 0) {
    insights.push({
      type: 'fuel-underuse',
      message: `Used ${Math.abs(dieselDiff)} liters less diesel than expected (${expectedDiesel} vs. ${totalDieselLiters}).`,
    });
  }

  // 4. Toll Cost Check
  //    a) Sum up actual toll expenses
  const totalTollSpent = expenses
    .filter((e) => e.expenseType === 'toll')
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  //    b) Compare with routeCd.tollAmt
  const expectedToll = routeCd.tollAmt || 0;
  const tollDiff = totalTollSpent - expectedToll;

  if (tollDiff > 0) {
    insights.push({
      type: 'toll-overrun',
      message: `Toll cost is ₹${tollDiff} higher than the expected ₹${expectedToll}. (Actual: ₹${totalTollSpent})`,
    });
  } else if (tollDiff < 0) {
    insights.push({
      type: 'toll-underrun',
      message: `Toll cost is ₹${Math.abs(tollDiff)} lower than the expected ₹${expectedToll}. (Actual: ₹${totalTollSpent})`,
    });
  }

  // 5. Driver Salary Check
  //    a) Sum up any "driver-salary" expenses
  const totalDriverSalary = expenses
    .filter((e) => e.expenseType === 'driver-salary')
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  //    b) Compare with the routeVehicleData.fixedSalary
  const expectedSalary = routeVehicleData.fixedSalary || 0;
  const salaryDiff = totalDriverSalary - expectedSalary;

  if (salaryDiff > 0) {
    insights.push({
      type: 'driver-salary-overrun',
      message: `Driver salary is ₹${salaryDiff} higher than the expected ₹${expectedSalary}. (Actual: ₹${totalDriverSalary})`,
    });
  } else if (salaryDiff < 0) {
    insights.push({
      type: 'driver-salary-underrun',
      message: `Driver salary is ₹${Math.abs(salaryDiff)} less than the expected ₹${expectedSalary}. (Actual: ₹${totalDriverSalary})`,
    });
  }

  // 6. Distance Deviation
  //    a) Actual distance = (endKm - startKm)
  const actualDistance = (endKm || 0) - (startKm || 0);
  //    b) Expected distance from routeCd
  const expectedDistance = routeCd.distance || 0;
  const distDiff = actualDistance - expectedDistance;

  if (distDiff > 0) {
    insights.push({
      type: 'distance-overrun',
      message: `Traveled ${distDiff} km more than the standard route distance of ${expectedDistance}. (Actual: ${actualDistance})`,
    });
  } else if (distDiff < 0) {
    insights.push({
      type: 'distance-underrun',
      message: `Traveled ${Math.abs(distDiff)} km less than the standard route distance of ${expectedDistance}. (Actual: ${actualDistance})`,
    });
  }

  // 7. Optional: AdBlue Check or Other Observations
  //    For example, if routeVehicleData.adBlue = 90 liters
  //    and subtrip has an "adblue" expense with a certain quantity, compare them.
  //    We'll omit that here, but you can add a similar pattern.

  // Return the final array of insights
  return insights;
}
