import { useMemo, useCallback } from 'react';

import { useFormConfigContext } from 'src/auth/form-config';
import { FORM_CONFIG_DEFAULTS } from 'src/auth/form-config/form-config-defaults';

/**
 * Merge base fields with customer override fields.
 * Override fields take precedence for any field they specify.
 */
function mergeFieldConfigs(baseFields, overrideFields) {
  if (!overrideFields) return baseFields;
  const merged = { ...baseFields };
  Object.entries(overrideFields).forEach(([fieldName, override]) => {
    if (merged[fieldName]) {
      merged[fieldName] = { ...merged[fieldName], ...override };
    }
  });
  return merged;
}

/**
 * Get the merged form config for a specific form type and optional customer.
 * @param {string} formType - 'job_create' | 'job_edit' | 'job_receive'
 * @param {string|null} customerId - Optional customer ID for overrides
 * @returns {{ fields: Object, freightConfig: Object, getLabel: Function, isVisible: Function, isRequired: Function }}
 */
export function useFormConfig(formType, customerId = null) {
  const { formConfigs } = useFormConfigContext();

  return useMemo(() => {
    const config = formConfigs?.[formType] || FORM_CONFIG_DEFAULTS[formType];
    if (!config) return { fields: {}, freightConfig: {} };

    let fields = config.fields || {};

    // Handle Mongoose Map serialization — convert if needed
    if (fields instanceof Map || (fields && typeof fields.entries === 'function')) {
      fields = Object.fromEntries(fields);
    }

    // Merge customer overrides if applicable
    if (customerId && config.customerOverrides) {
      const override = config.customerOverrides.find(
        (o) => (o.customerId?._id || o.customerId) === customerId
      );
      if (override) {
        let overrideFields = override.fields || {};
        if (overrideFields instanceof Map || (overrideFields && typeof overrideFields.entries === 'function')) {
          overrideFields = Object.fromEntries(overrideFields);
        }
        fields = mergeFieldConfigs(fields, overrideFields);
      }
    }

    return {
      fields,
      freightConfig: config.freightConfig || FORM_CONFIG_DEFAULTS[formType]?.freightConfig || {},
    };
  }, [formConfigs, formType, customerId]);
}

/**
 * Get visibility for a specific field.
 * @returns 'required' | 'optional' | 'hidden'
 */
export function useFieldVisibility(formType, fieldName, customerId = null) {
  const { fields } = useFormConfig(formType, customerId);
  return fields[fieldName]?.visibility || 'optional';
}

/**
 * Get the label for a specific field with fallback.
 */
export function useFieldLabel(formType, fieldName, customerId = null, fallback = '') {
  const { fields } = useFormConfig(formType, customerId);
  return fields[fieldName]?.label || fallback;
}

/**
 * Get all visible fields (not hidden) for a form type.
 */
export function useVisibleFields(formType, customerId = null) {
  const { fields } = useFormConfig(formType, customerId);
  return useMemo(
    () => Object.entries(fields)
      .filter(([, config]) => config.visibility !== 'hidden')
      .map(([name, config]) => ({ name, ...config })),
    [fields]
  );
}

/**
 * Get all required fields for a form type.
 */
export function useRequiredFields(formType, customerId = null) {
  const { fields } = useFormConfig(formType, customerId);
  return useMemo(
    () => Object.entries(fields)
      .filter(([, config]) => config.visibility === 'required')
      .map(([name]) => name),
    [fields]
  );
}

/**
 * Get freight config (default model + allowed models).
 */
export function useFreightConfig(formType = 'job_create', customerId = null) {
  const { freightConfig } = useFormConfig(formType, customerId);
  return freightConfig;
}

/**
 * Helper hook that returns utility functions for field config.
 * Use this in form components for cleaner code.
 */
export function useFormFieldHelpers(formType, customerId = null) {
  const { fields, freightConfig } = useFormConfig(formType, customerId);

  const isVisible = useCallback(
    (fieldName) => {
      const field = fields[fieldName];
      return field ? field.visibility !== 'hidden' : true;
    },
    [fields]
  );

  const isRequired = useCallback(
    (fieldName) => {
      const field = fields[fieldName];
      return field ? field.visibility === 'required' : false;
    },
    [fields]
  );

  const getLabel = useCallback(
    (fieldName, fallback = '') => {
      const field = fields[fieldName];
      const label = field?.label || fallback;
      return isRequired(fieldName) ? `${label} *` : label;
    },
    [fields, isRequired]
  );

  return { isVisible, isRequired, getLabel, fields, freightConfig };
}
