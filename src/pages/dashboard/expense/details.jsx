import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { dispatch } from 'src/redux/store';
import { fetchExpense } from 'src/redux/slices/expense';

import { ExpenseDetailView } from 'src/sections/expense/views';

// ----------------------------------------------------------------------

const metadata = { title: `Expense details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  useEffect(() => {
    dispatch(fetchExpense(id));
  }, [id]);

  const { expense: currentExpense, isLoading } = useSelector((state) => state.expense);

  if (isLoading) return <div>Loading...</div>;
  if (!currentExpense) return <div>No Expense Found...</div>;

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ExpenseDetailView expense={currentExpense} />
    </>
  );
}
