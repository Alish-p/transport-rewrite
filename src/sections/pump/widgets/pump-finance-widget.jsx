import { BankDetailsCard } from 'src/components/bank';

// ----------------------------------------------------------------------

export function PumpFinanceWidget({ pump }) {
  return <BankDetailsCard bankDetails={pump?.bankDetails} />;
}

export default PumpFinanceWidget;
