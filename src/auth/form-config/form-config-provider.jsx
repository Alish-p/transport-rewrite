import { useMemo, useState, useEffect, useCallback } from 'react';

import axios from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import { FormConfigContext } from './form-config-context';
import { FORM_CONFIG_DEFAULTS } from './form-config-defaults';

export function FormConfigProvider({ children }) {
  const { user } = useAuthContext();
  const [formConfigs, setFormConfigs] = useState(FORM_CONFIG_DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFormConfigs(FORM_CONFIG_DEFAULTS);
      setLoading(false);
      return;
    }

    const fetchConfigs = async () => {
      try {
        const { data } = await axios.get('/api/form-configs');
        if (data && Object.keys(data).length > 0) {
          setFormConfigs(data);
        }
      } catch (error) {
        console.error('Failed to fetch form configs, using defaults', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, [user]);

  const refreshFormConfigs = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/form-configs');
      if (data && Object.keys(data).length > 0) {
        setFormConfigs(data);
      }
    } catch (error) {
      console.error('Failed to refresh form configs', error);
    }
  }, []);

  const contextValue = useMemo(
    () => ({ formConfigs, loading, refreshFormConfigs }),
    [formConfigs, loading, refreshFormConfigs]
  );

  return (
    <FormConfigContext.Provider value={contextValue}>
      {children}
    </FormConfigContext.Provider>
  );
}
