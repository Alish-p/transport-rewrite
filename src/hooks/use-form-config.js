import { useMemo, useCallback } from 'react';

import { useFieldConfigContext } from 'src/auth/field-config';
import { FIELD_CONFIG_DEFAULTS } from 'src/auth/field-config/field-config-defaults';

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
 * Get the merged field config for a specific entity and optional customer.
 * @param {string} entity - 'subtrip' | 'vehicle' | 'driver'
 * @param {string|null} customerId - Optional customer ID for overrides
 * @returns {{ fields: Object, freightConfig: Object }}
 */
export function useFieldConfig(entity, customerId = null) {
  const { fieldConfigs } = useFieldConfigContext();

  return useMemo(() => {
    const config = fieldConfigs?.[entity] || FIELD_CONFIG_DEFAULTS[entity];
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
        if (
          overrideFields instanceof Map ||
          (overrideFields && typeof overrideFields.entries === 'function')
        ) {
          overrideFields = Object.fromEntries(overrideFields);
        }
        fields = mergeFieldConfigs(fields, overrideFields);
      }
    }

    return {
      fields,
      freightConfig: config.freightConfig || FIELD_CONFIG_DEFAULTS[entity]?.freightConfig || {},
    };
  }, [fieldConfigs, entity, customerId]);
}

/**
 * Get visibility for a specific field.
 * @returns 'required' | 'optional' | 'hidden'
 */
export function useFieldVisibility(entity, fieldName, customerId = null) {
  const { fields } = useFieldConfig(entity, customerId);
  return fields[fieldName]?.visibility || 'optional';
}

/**
 * Get the label for a specific field with fallback.
 */
export function useFieldLabel(entity, fieldName, customerId = null, fallback = '') {
  const { fields } = useFieldConfig(entity, customerId);
  return fields[fieldName]?.label || fallback;
}

/**
 * Get all visible fields (not hidden) for an entity.
 */
export function useVisibleFields(entity, customerId = null) {
  const { fields } = useFieldConfig(entity, customerId);
  return useMemo(
    () =>
      Object.entries(fields)
        .filter(([, config]) => config.visibility !== 'hidden')
        .map(([name, config]) => ({ name, ...config })),
    [fields]
  );
}

/**
 * Get all required fields for an entity.
 */
export function useRequiredFields(entity, customerId = null) {
  const { fields } = useFieldConfig(entity, customerId);
  return useMemo(
    () =>
      Object.entries(fields)
        .filter(([, config]) => config.visibility === 'required')
        .map(([name]) => name),
    [fields]
  );
}

/**
 * Get freight config (default model + allowed models).
 */
export function useFreightConfig(entity = 'subtrip', customerId = null) {
  const { freightConfig } = useFieldConfig(entity, customerId);
  return freightConfig;
}

/**
 * Helper hook that returns utility functions for field config.
 * Use this in form components for cleaner code.
 */
export function useFieldHelpers(entity, customerId = null) {
  const { fields, freightConfig } = useFieldConfig(entity, customerId);

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
