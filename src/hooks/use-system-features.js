import { useTenantContext } from 'src/auth/tenant';

export function useSystemFeatures() {
  const tenant = useTenantContext();
  
  return {
    marketVehicles: tenant?.config?.marketVehicles !== false,
    pumps: tenant?.config?.pumps !== false,
  };
}

export default useSystemFeatures;
