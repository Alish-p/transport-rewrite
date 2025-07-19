import { useMemo, useState, useCallback, createContext, useEffect } from 'react';

import { useTenantContext } from 'src/auth/tenant';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { STORAGE_KEY } from '../config-settings';

// ----------------------------------------------------------------------

export const SettingsContext = createContext(undefined);

export const SettingsConsumer = SettingsContext.Consumer;

// ----------------------------------------------------------------------

export function SettingsProvider({ children, settings }) {
  const { theme: tenantTheme } = useTenantContext() ?? {};

  const values = useLocalStorage(STORAGE_KEY, settings);

  useEffect(() => {
    if (tenantTheme) {
      values.setField('primaryColor', tenantTheme);
    }
  }, [tenantTheme, values.setField]);

  const [openDrawer, setOpenDrawer] = useState(false);

  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      ...values.state,
      canReset: values.canReset,
      onReset: values.resetState,
      onUpdate: values.setState,
      onUpdateField: values.setField,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
    }),
    [
      values.canReset,
      values.resetState,
      values.setField,
      values.setState,
      values.state,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
    ]
  );

  return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}
