import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchVehicles } from 'src/redux/slices/vehicle';

import { VehicleExpenseCreateView } from 'src/sections/expense/views/vehicle-expense-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Expense | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const { vehicles } = useSelector((state) => state.vehicle);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <VehicleExpenseCreateView vehicles={vehicles} />
    </>
  );
}
