import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { useTenantById } from 'src/query/use-tenant-admin';
import TenantAdminEditView from 'src/sections/tenant-admin/tenant-admin-edit-view';

const metadata = { title: `Edit Tenant | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();
  const { data: tenant, isLoading, isError, refetch } = useTenantById(id);

  if (isLoading) return <LoadingScreen />;
  if (isError || !tenant) return <EmptyContent />;

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <TenantAdminEditView tenant={tenant} onUpdated={() => refetch()} />
    </>
  );
}

