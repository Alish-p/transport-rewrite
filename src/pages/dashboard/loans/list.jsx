import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { fetchLoans } from 'src/redux/slices/loan';
import { useSelector, useDispatch } from 'src/redux/store';

import { LoansListView } from 'src/sections/loans/views';

// ----------------------------------------------------------------------

const metadata = { title: `Loans list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLoans());
  }, [dispatch]);

  const { loans, isLoading } = useSelector((state) => state.loan);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LoansListView loans={loans} />
    </>
  );
}
