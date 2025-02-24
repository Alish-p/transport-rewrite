import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useSubtrips } from 'src/query/use-subtrip';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { SubtripListView } from 'src/sections/subtrip/views';
// ----------------------------------------------------------------------

const metadata = { title: `Subtrip list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: subtrips, isLoading, isError } = useSubtrips();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <EmptyContent
        filled
        title="Something went wrong!"
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SubtripListView subtrips={subtrips} />
    </>
  );
}
