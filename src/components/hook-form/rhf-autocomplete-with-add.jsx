import { Controller, useFormContext } from 'react-hook-form';

import { TextField, Autocomplete } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

export default function RHFAutocompleteWithAdd({ name, label, options, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              field.onChange({ label: newValue, value: newValue });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              field.onChange({ label: newValue.inputValue, value: newValue.inputValue });
            } else {
              field.onChange(newValue);
            }
          }}
          filterOptions={(option, params) => {
            const filtered = filter(option, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = option.some((o) => inputValue === o.label);
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                label: inputValue,
                value: inputValue,
              });
            }

            return filtered;
          }}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.label;
          }}
          options={options}
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          renderOption={(props, option) => <li {...props}>{option.label}</li>}
          renderInput={(params) => (
            <TextField {...params} label={label} error={!!error} helperText={error?.message} />
          )}
          {...other}
        />
      )}
    />
  );
}
