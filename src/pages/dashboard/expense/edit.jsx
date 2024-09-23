import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'src/routes/hooks';

import { paramCase } from 'src/utils/change-case';

import { CONFIG } from 'src/config-global';
import { fetchSubtrips } from 'src/redux/slices/subtrip';
import { fetchVehicles } from 'src/redux/slices/vehicle';

import { ExpenseEditView } from 'src/sections/expense/views';

// ----------------------------------------------------------------------

const metadata = { title: `Expense edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  const { id = '' } = useParams();

  const currentExpense = useSelector((state) =>
    state.expense.expenses.find((expense) => paramCase(expense._id) === id)
  );

  useEffect(() => {
    dispatch(fetchSubtrips());
    dispatch(fetchVehicles());
  }, [dispatch]);

  const { subtrips } = useSelector((state) => state.subtrip);
  const { vehicles } = useSelector((state) => state.vehicle);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ExpenseEditView expense={currentExpense} subtrips={subtrips} vehicles={vehicles} />
    </>
  );
}
