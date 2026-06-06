import { useContext } from 'react';
import { FormConfigContext } from './form-config-context';

export function useFormConfigContext() {
  const context = useContext(FormConfigContext);
  if (context === undefined) {
    throw new Error('useFormConfigContext must be used inside FormConfigProvider');
  }
  return context;
}
