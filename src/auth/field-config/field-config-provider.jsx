import { useMemo, useState, useEffect, useCallback } from 'react';

import axios from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import { FieldConfigContext } from './field-config-context';
import { FIELD_CONFIG_DEFAULTS } from './field-config-defaults';

export function FieldConfigProvider({ children }) {
  const { user } = useAuthContext();
  const [fieldConfigs, setFieldConfigs] = useState(FIELD_CONFIG_DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFieldConfigs(FIELD_CONFIG_DEFAULTS);
      setLoading(false);
      return;
    }

    const fetchConfigs = async () => {
      try {
        const { data } = await axios.get('/api/field-configs/subtrip');
        if (data && Object.keys(data).length > 0) {
          setFieldConfigs({ subtrip: data });
        }
      } catch (error) {
        console.error('Failed to fetch field configs, using defaults', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, [user]);

  const refreshFieldConfigs = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/field-configs/subtrip');
      if (data && Object.keys(data).length > 0) {
        setFieldConfigs({ subtrip: data });
      }
    } catch (error) {
      console.error('Failed to refresh field configs', error);
    }
  }, []);

  const contextValue = useMemo(
    () => ({ fieldConfigs, loading, refreshFieldConfigs }),
    [fieldConfigs, loading, refreshFieldConfigs]
  );

  return (
    <FieldConfigContext.Provider value={contextValue}>
      {children}
    </FieldConfigContext.Provider>
  );
}
