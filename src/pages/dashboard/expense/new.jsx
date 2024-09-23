import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchSubtrips } from 'src/redux/slices/subtrip';
import { fetchVehicles } from 'src/redux/slices/vehicle';

import { ExpenseCreateView } from 'src/sections/expense/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Expense | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

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

      <ExpenseCreateView subtrips={subtrips} vehicles={vehicles} />
    </>
  );
}
