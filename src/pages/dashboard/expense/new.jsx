import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchSubtrips } from 'src/redux/slices/subtrip';

import { SubtripExpenseCreateView } from 'src/sections/expense/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Expense | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSubtrips());
  }, [dispatch]);

  const { subtrips } = useSelector((state) => state.subtrip);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SubtripExpenseCreateView subtrips={subtrips} />
    </>
  );
}
