import { useFieldVisibility } from 'src/hooks/use-form-config';

/**
 * Wrapper that conditionally renders a form field based on FormConfig visibility.
 * If the field is 'hidden', renders nothing.
 * If 'required', the children render as-is (label should include * via useFormFieldHelpers).
 * If 'optional', the children render as-is.
 *
 * @param {string} formType - 'job_create' | 'job_edit' | 'job_receive'
 * @param {string} name - Field name matching FormConfig key
 * @param {string|null} customerId - Optional customer ID for overrides
 * @param {React.ReactNode} children - The Field.* component to render
 */
export function ConfigurableField({ formType, name, customerId = null, children }) {
  const visibility = useFieldVisibility(formType, name, customerId);

  if (visibility === 'hidden') {
    return null;
  }

  return children;
}
