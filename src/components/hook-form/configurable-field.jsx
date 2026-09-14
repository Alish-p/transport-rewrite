import { useFieldVisibility } from 'src/hooks/use-form-config';

/**
 * Wrapper that conditionally renders a form field based on FieldConfig visibility.
 * If the field is 'hidden', renders nothing.
 * If 'required', the children render as-is (label should include * via useFieldHelpers).
 * If 'optional', the children render as-is.
 *
 * @param {string} entity - 'subtrip' | 'vehicle' | 'driver'
 * @param {string} name - Field name matching FieldConfig key
 * @param {React.ReactNode} children - The Field.* component to render
 */
export function ConfigurableField({ entity, name, children }) {
  const visibility = useFieldVisibility(entity, name);

  if (visibility === 'hidden') {
    return null;
  }

  return children;
}
