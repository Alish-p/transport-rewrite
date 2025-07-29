import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';

const StyledSelect = styled(Select)(({ theme }) => ({
  fontSize: 14,
  minWidth: 70,
  maxWidth: 100,
  '& .MuiSelect-select': {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 24,
    borderRadius: 6,
    backgroundColor:
      theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[800],
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[700],
      borderColor: theme.palette.grey[400],
    },
    '&:focus': {
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
    },
  },
  '& .MuiSelect-icon': {
    top: '50%',
    right: 4,
    transform: 'translateY(-50%)',
    fontSize: 18,
    color: theme.palette.grey[600],
    transition: 'transform 0.2s ease-in-out',
  },
  '&.Mui-focused .MuiSelect-icon': {
    transform: 'translateY(-50%) rotate(180deg)',
    color: theme.palette.primary.main,
  },
  '&:before, &:after': {
    display: 'none',
  },
}));

const StyledInputAdornment = styled(InputAdornment)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  '&:before': {
    content: '""',
    position: 'absolute',
    left: -8,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 1,
    height: '60%',
    backgroundColor: theme.palette.divider,
    opacity: 0.5,
  },
}));

export default function RHFInputWithUnit({
  name,
  unitName,
  units = [],
  label,
  helperText,
  placeholder,
  type = 'number',
  ...other
}) {
  const { control, setValue, watch } = useFormContext();

  const currentUnit = watch(unitName);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          label={label}
          placeholder={type === 'number' && !placeholder ? '0' : placeholder}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(e) => {
            if (type === 'number') {
              const value = e.target.value === '' ? 0 : Number(e.target.value);
              field.onChange(value);
            } else {
              field.onChange(e.target.value);
            }
          }}
          onWheel={type === 'number' ? (e) => e.target.blur() : undefined}
          InputLabelProps={type === 'number' ? { shrink: true } : undefined}
          error={!!error}
          helperText={error?.message ?? helperText}
          InputProps={{
            endAdornment: (
              <StyledInputAdornment position="end">
                <StyledSelect
                  variant="standard"
                  disableUnderline
                  value={currentUnit || units[0] || ''}
                  onChange={(e) => setValue(unitName, e.target.value, { shouldValidate: true })}
                  displayEmpty
                  renderValue={(selected) => selected || 'Unit'}
                >
                  {units.map((unit) => (
                    <MenuItem
                      key={unit}
                      value={unit}
                      sx={{
                        textTransform: 'capitalize',
                        fontSize: 14,
                        minHeight: 36,
                        '&:hover': {
                          backgroundColor: (theme) => theme.palette.action.hover,
                        },
                        '&.Mui-selected': {
                          backgroundColor: (theme) => `${theme.palette.primary.main}10`,
                          '&:hover': {
                            backgroundColor: (theme) => `${theme.palette.primary.main}20`,
                          },
                        },
                      }}
                    >
                      {unit}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </StyledInputAdornment>
            ),
          }}
          {...other}
        />
      )}
    />
  );
}
