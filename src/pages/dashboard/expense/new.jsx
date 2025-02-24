import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { usePumps } from 'src/query/use-pump';
import { useSubtrips } from 'src/query/use-subtrip';

import { SubtripExpenseCreateView } from 'src/sections/expense/views';

import { EmptyContent } from '../../../components/empty-content';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Expense | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: subtrips, isLoading: subtripsLoading, isError: subtripError } = useSubtrips();
  const { data: pumps, isLoading: pumpsLoading, isError: pumpError } = usePumps();

  if (subtripsLoading || pumpsLoading) {
    return <LoadingScreen />;
  }

  if (subtripError || pumpError) {
    return (
      <EmptyContent
        filled
        title="Error Fetching Data !"
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SubtripExpenseCreateView subtrips={subtrips} pumps={pumps} />
    </>
  );
}
