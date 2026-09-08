import { BankDetailsCard } from 'src/components/bank';

// ----------------------------------------------------------------------

export function DriverFinanceWidget({ driver }) {
  const { bankDetails } = driver || {};

  return <BankDetailsCard title="Finance Details" bankDetails={bankDetails} />;
}

export default DriverFinanceWidget;
