import { useContext } from 'react';

import { FieldConfigContext } from './field-config-context';

export function useFieldConfigContext() {
  const context = useContext(FieldConfigContext);
  if (context === undefined) {
    throw new Error('useFieldConfigContext must be used inside FieldConfigProvider');
  }
  return context;
}
