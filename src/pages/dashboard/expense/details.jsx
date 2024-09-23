import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { paramCase } from 'src/utils/change-case';

import { CONFIG } from 'src/config-global';

import { ExpenseDetailView } from 'src/sections/expense/views';

// ----------------------------------------------------------------------

const metadata = { title: `Expense details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentExpense = useSelector((state) =>
    state.expense.expenses.find((expense) => paramCase(expense._id) === id)
  );

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ExpenseDetailView expense={currentExpense} />
    </>
  );
}
