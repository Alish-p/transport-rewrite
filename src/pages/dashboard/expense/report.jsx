import { Helmet } from 'react-helmet-async';

import { ExpenseReportView } from 'src/sections/expense/views';

// ----------------------------------------------------------------------

export default function ExpenseReportPage() {
  return (
    <>
      <Helmet>
        <title> Expense Report</title>
      </Helmet>

      <ExpenseReportView />
    </>
  );
}
