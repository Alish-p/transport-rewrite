import { useTenantContext } from 'src/auth/tenant';

export function useSystemFeatures() {
  const tenant = useTenantContext();
  
  return {
    marketVehicles: tenant?.config?.vehicle?.marketVehicles !== false,
    pumps: tenant?.config?.pump?.enabled !== false,
  };
}

export default useSystemFeatures;
