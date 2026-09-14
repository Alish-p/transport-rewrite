import { useTenant } from 'src/query/use-tenant';

import { useAuthContext } from 'src/auth/hooks';

import { TenantContext } from './tenant-context';

export function TenantProvider({ children }) {
  const { tenant: authTenant } = useAuthContext();
  const { data: queryTenant } = useTenant({ enabled: !!authTenant }); // Fetching New Tenant if Updated so user does not have to refresh after tenant change 

  const activeTenant = queryTenant || authTenant;

  return <TenantContext.Provider value={activeTenant}>{children}</TenantContext.Provider>;
}