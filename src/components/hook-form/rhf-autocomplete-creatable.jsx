import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

/**
 * RHFAutocompleteCreatable
 *
 * A wrapper for MUI Autocomplete that allows selecting from options OR creating a new string value.
 *
 * Props:
 * - name: form field name
 * - label: label for the input
 * - options: array of strings (e.g. ['Option 1', 'Option 2'])
 * - helperText: error or helper text
 * - ...other: other props for Autocomplete
 */
export function RHFAutocompleteCreatable({ name, label, options = [], helperText, ...other }) {
    const { control, setValue } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    // Ensure value is always controlled; default to null if empty
                    value={field.value || null}
                    onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                            // User typed something and hit Enter (if freeSolo allows) or selected a string option
                            setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
                        } else if (newValue && newValue.inputValue) {
                            // User selected the "Add 'xxx'" option
                            setValue(name, newValue.inputValue, { shouldValidate: true, shouldDirty: true });
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
                    options={options}
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
