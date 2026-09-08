import { paths } from 'src/routes/paths';

import { BankDetailsCard } from 'src/components/bank';

// ----------------------------------------------------------------------

export function DriverFinanceWidget({ driver }) {
  const { _id, bankDetails } = driver || {};

  return (
    <BankDetailsCard
      title="Finance Details"
      bankDetails={bankDetails}
      editHref={_id ? paths.dashboard.driver.edit(_id) : undefined}
    />
  );
}

export default DriverFinanceWidget;
