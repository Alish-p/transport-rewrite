import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useBanks } from 'src/query/use-bank';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { BankListView } from 'src/sections/bank/views';

// ----------------------------------------------------------------------

const metadata = { title: `Bank list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  const { data: banks, isLoading, isError } = useBanks();

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (isError) {
    return (
      <EmptyContent
        filled
        title="No Banks found!"
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BankListView banks={banks} />
    </>
  );
}
