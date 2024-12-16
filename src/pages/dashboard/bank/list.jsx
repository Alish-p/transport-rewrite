import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import { LinearProgress } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { fetchBanks } from 'src/redux/slices/bank';

import { BankListView } from 'src/sections/bank/views';

// ----------------------------------------------------------------------

const metadata = { title: `Bank list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  const { banks, isLoading } = useSelector((state) => state.bank);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {isLoading ? (
        <LinearProgress color="primary" sx={{ mb: 2, width: 1 }} />
      ) : banks?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h3>No banks found</h3>
        </div>
      ) : (
        <BankListView banks={banks} />
      )}
    </>
  );
}
