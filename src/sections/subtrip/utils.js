import { fDate } from '../../utils/format-time';
import { loadingWeightUnit } from '../vehicle/vehicle-config';
import { subtripExpenseTypes } from '../expense/expense-config';

export const mapExpensesToChartData = (expenses) => {
  const expenseData = subtripExpenseTypes.map((type) => {
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
 *   - tripId.vehicleId
 * @returns {Array} An array of insight objects (each with a `type` and `message`).
 */
export function generateInsightsForSubtrip(subtrip) {
  const insights = [];

  // 1. Safety checks
  if (!subtrip.routeCd || !subtrip.tripId || !subtrip.tripId.vehicleId) {
    // If we lack route data or vehicle data, we cannot compare expected vs actual
    return insights; // Return an empty array
  }

  const { routeCd, expenses, startKm, endKm } = subtrip;
  const vehicleType = subtrip.tripId.vehicleId.vehicleType
    ? subtrip.tripId.vehicleId.vehicleType.toLowerCase()
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

export function transformSubtripsForExcel(subtrips) {
  const rows = subtrips.map((subtrip) => {
    const vehicle = subtrip?.tripId?.vehicleId;
    const driver = subtrip?.tripId?.driverId;
    const transporter = vehicle?.transporter;
    const customer = subtrip?.customerId;

    return {
      'Subtrip No': subtrip._id,
      'Trip No': subtrip?.tripId?._id,
      Customer: customer?.customerName,
      'Vehicle No': vehicle?.vehicleNo,
      'Vehicle Type': vehicle?.vehicleType,
      'No of Tyres': vehicle?.noOfTyres,
      'Driver Name': driver?.driverName,
      'Driver Mobile': driver?.driverCellNo,
      'Transporter Name': transporter?.transportName || '',
      'Loading Point': subtrip.loadingPoint,
      'Unloading Point': subtrip.unloadingPoint,
      'Dispatch Date': fDate(subtrip.startDate),
      'Received Date': fDate(subtrip.endDate),
      'E-Way Expiry': fDate(subtrip.ewayExpiryDate),
      'Initial Diesel (Ltr)': subtrip?.initialAdvanceDiesel || 0,
      Advance: subtrip?.expenses?.reduce(
        (acc, e) => (e.expenseType === 'trip-advance' ? acc + e.amount : acc),
        0
      ),
      'Invoice No': subtrip.invoiceNo || '-',
      'Invoice Amount':
        subtrip.events?.find((e) => e.eventType === 'INVOICE_GENERATED')?.details?.amount || 0,
      'Freight Rate (₹)': subtrip.rate || 0,
      'Loading Wt.': `${subtrip.loadingWeight} ${loadingWeightUnit[vehicle?.vehicleType]}` || 0,
      'Unloading Wt.': `${subtrip.unloadingWeight} ${loadingWeightUnit[vehicle?.vehicleType]}` || 0,
      'Shortage Wt.': subtrip.shortageWeight || 0,
      'Shortage Amt.': subtrip.shortageAmount || 0,
      Consignee: subtrip.consignee,
      'Route Name': subtrip.routeCd?.routeName || '-',
      'Distance (km)': subtrip.routeCd?.distance || 0,
      'Initial Fuel Pump': subtrip.intentFuelPump?.pumpName || '-',
    };
  });

  // Calculate totals
  const totals = {
    'Subtrip No': 'TOTAL',
    'Trip No': '',
    Customer: '',
    'Vehicle No': '',
    'Vehicle Type': '',
    'No of Tyres': '',
    'Driver Name': '',
    'Driver Mobile': '',
    'Transporter Name': '',
    'Loading Point': '',
    'Unloading Point': '',
    'Dispatch Date': '',
    'Received Date': '',
    'E-Way Expiry': '',
    'Initial Diesel (Ltr)': subtrips.reduce((sum, st) => sum + (st.initialAdvanceDiesel || 0), 0),
    Advance: rows.reduce((sum, r) => sum + r.Advance, 0),
    'Invoice No': '',
    'Invoice Amount': '',
    'Freight Rate (₹)': '',
    'Loading Wt.': subtrips.reduce((sum, st) => sum + (st.loadingWeight || 0), 0),
    'Unloading Wt.': subtrips.reduce((sum, st) => sum + (st.unloadingWeight || 0), 0),
    'Shortage Wt.': subtrips.reduce((sum, st) => sum + (st.shortageWeight || 0), 0),
    'Shortage Amt.': subtrips.reduce((sum, st) => sum + (st.shortageAmount || 0), 0),
    Consignee: '',
    'Route Name': '',
    'Distance (km)': subtrips.reduce((sum, st) => sum + (st.routeCd?.distance || 0), 0),
    'Initial Fuel Pump': '',
  };

  return [...rows, totals];
}
