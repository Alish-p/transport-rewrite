import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useSubtrip } from 'src/query/use-subtrip';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { TenantContext } from 'src/auth/tenant';
import { SubtripDetailView } from 'src/sections/subtrip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Job Details | Public - ${CONFIG.site.name}` };

export default function PublicSubtripDetailsPage() {
  const { id } = useParams();

  const { data: subtrip, isLoading, isError } = useSubtrip(id);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !subtrip) {
    return (
      <EmptyContent
        filled
        title="Unable to load job details"
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {/* Provide a default tenant for PDFs and headers when not authenticated */}
      <TenantContext.Provider value={CONFIG.company}>
        <SubtripDetailView subtrip={subtrip} publicMode />
      </TenantContext.Provider>
    </>
  );
}

