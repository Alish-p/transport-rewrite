import { useMemo } from 'react';

import { fCurrency } from 'src/utils/format-number';

function useExpenseInsights(subtrip) {
  const {
    routeCd: routeInfo,
    tripId: { vehicleId: vehicleInfo } = {},
    rate = 0,
    loadingWeight = 0,
  } = subtrip || {};

  const extractedData = useMemo(() => {
    if (vehicleInfo && routeInfo?.salary) {
      return routeInfo.salary.find(
        (s) => s.vehicleType.toLowerCase() === vehicleInfo.vehicleType.toLowerCase()
      );
    }
    return null;
  }, [vehicleInfo, routeInfo]);

  const extractedResult = useMemo(
    () => ({
      tollAmt: routeInfo?.tollAmt || 0,
      routeName: routeInfo?.routeName || '',
      fixedSalary: extractedData?.fixedSalary || 0,
      percentageSalary: extractedData?.percentageSalary || 0,
      performanceMilage: extractedData?.performanceMilage || 0,
      diesel: extractedData?.diesel || 0,
      adBlue: extractedData?.adBlue || 0,
      advanceAmt: extractedData?.advanceAmt || 0,
    }),
    [routeInfo, extractedData]
  );

  const alertContent = useMemo(
    () => ({
      'driver-salary': [
        `Fixed Salary for this Trip is ${extractedResult.fixedSalary || 0}.`,
        `The Variable salary for this trip is calculated as Rate × Weight × Percentage = ${rate} × ${loadingWeight} × ${extractedResult.percentageSalary / 100} = ${rate * loadingWeight * (extractedResult.percentageSalary / 100)}.`,
      ],
      diesel: [
        `For trip ${extractedResult.routeName}, usual diesel consumption is ${extractedResult.diesel}Ltr.`,
      ],
      adblue: [
        `For trip ${extractedResult.routeName}, usual AdBlue consumption is ${extractedResult.adBlue}Ltr.`,
      ],
      toll: [
        `For trip ${extractedResult.routeName}, usual toll expenses are ${fCurrency(extractedResult.tollAmt)}.`,
      ],
    }),
    [rate, loadingWeight, extractedResult]
  );

  return {
    alertContent,
    extractedResult,
  };
}

export default useExpenseInsights;
