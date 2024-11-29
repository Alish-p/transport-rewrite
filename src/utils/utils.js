export const calculateDriverSalary = (subtrip, vehicleType) => {
  const { fixedSalary, percentageSalary } = subtrip.routeCd.salary[0];
  const comission = subtrip.rate * subtrip.loadingWeight * 0.95 * percentageSalary * 0.01;
  return comission + fixedSalary;
};
