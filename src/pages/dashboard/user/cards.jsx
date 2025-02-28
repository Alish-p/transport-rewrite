import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useUsers } from 'src/query/use-user';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { UserCardsView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `User cards | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: users, isLoading, isError } = useUsers();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <EmptyContent filled title="Something went wrong!" />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserCardsView users={users} />
    </>
  );
}
