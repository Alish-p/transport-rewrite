import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import { useOptions, useCreateOption } from 'src/query/use-options';

const filter = createFilterOptions();

/**
 * RHFAutocompleteCreatable
 *
 * A wrapper for MUI Autocomplete that allows selecting from options OR creating a new string value.
 *
 * Props:
 * - name: form field name
 * - label: label for the input
 * - options: array of strings (e.g. ['Option 1', 'Option 2']) for static usage
 * - optionsGroup: string group key to load options from /api/options/:group and create new ones
 * - helperText: error or helper text
 * - ...other: other props for Autocomplete
 */
export function RHFAutocompleteCreatable({
  name,
  label,
  options = [],
  optionsGroup,
  helperText,
  ...other
}) {
  const { control, setValue } = useFormContext();

  const { data: dynamicOptions = [], isLoading } = useOptions(optionsGroup, {
    enabled: !!optionsGroup,
  });

  const createOption = useCreateOption();

  // When using dynamic options, map server objects to simple strings (label/value)
  const computedOptions = optionsGroup
    ? dynamicOptions.map((opt) => opt?.label || opt?.value).filter(Boolean)
    : options;

  const handleCreateOption = async (label) => {
    if (!optionsGroup || !label) return;
    try {
      await createOption({
        group: optionsGroup,
        label,
        value: label,
      });
    } catch (error) {
      // Error toast is handled inside the mutation hook
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          // Ensure value is always controlled; default to null if empty
          value={field.value || null}
          options={computedOptions}
          loading={isLoading}
          onChange={async (event, newValue) => {
            if (typeof newValue === 'string') {
              // User typed something and hit Enter (if freeSolo allows) or selected a string option
              setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
              if (optionsGroup && !computedOptions.includes(newValue)) {
                await handleCreateOption(newValue);
              }
            } else if (newValue && newValue.inputValue) {
              // User selected the "Create 'xxx'" option
              const valueToSave = newValue.inputValue;
              setValue(name, valueToSave, { shouldValidate: true, shouldDirty: true });
              if (optionsGroup && !computedOptions.includes(valueToSave)) {
                await handleCreateOption(valueToSave);
              }
            } else {
              // User selected a regular option or cleared the input (newValue is null)
              setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
            }
          }}
          filterOptions={(optionsList, params) => {
            const filtered = filter(optionsList, params);

            const { inputValue } = params;
            // Check if the input value already exists in the options
            const isExisting = optionsList.some((option) => option === inputValue);

            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                title: `Create "${inputValue}"`,
              });
            }

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option.title || option;
          }}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key} {...optionProps}>
                {option.title || option}
              </li>
            );
          }}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!error}
              helperText={error?.message || helperText}
            />
          )}
          {...other}
        />
      )}
    />
  );
}
