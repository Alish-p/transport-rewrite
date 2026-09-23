import { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

/**
 * RHFInputWithUnit
 * A React Hook Form compatible text/number input with a selectable unit in the end adornment.
 * Persists the value to `name` and the unit to `unitName` within the same form.
 */
export function RHFInputWithUnit({
  name,
  unitName,
  label,
  helperText,
  placeholder = '0',
  unitOptions = [
    { label: 'Ltr', value: 'ltr' },
    { label: 'Amount', value: 'amount' },
  ],
  defaultUnit = 'ltr',
  disabledUnit = false,
  textFieldProps = {},
}) {
  const { control, watch, setValue } = useFormContext();

  const [menuEl, setMenuEl] = useState(null);
  const unit = watch(unitName) || defaultUnit;

  const unitLabel = useMemo(
    () => unitOptions.find((u) => u.value === unit)?.label || '',
    [unit, unitOptions]
  );

  const handleOpenMenu = (e) => setMenuEl(e.currentTarget);
  const handleCloseMenu = () => setMenuEl(null);
  const handleSelectUnit = (val) => {
    setValue(unitName, val, { shouldValidate: true, shouldDirty: true });
    handleCloseMenu();
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          const displayValue =
            field.value === undefined || field.value === null || Number.isNaN(field.value)
              ? ''
              : field.value;

          return (
            <TextField
              {...field}
              value={displayValue}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  field.onChange('');
                  return;
                }
                // Allow user to type numbers and an optional single decimal point
                if (/^[0-9]*\.?[0-9]*$/.test(val)) {
                  // Normalize leading zeros for integers e.g. "05" -> "5", while keeping "0" or "0."
                  if (!val.includes('.') && val.length > 1 && val.startsWith('0')) {
                    field.onChange(val.replace(/^0+(?=\d)/, ''));
                  } else {
                    field.onChange(val);
                  }
                }
              }}
              onBlur={() => {
                field.onBlur();
                // Strip trailing dot on blur if user typed e.g. "12."
                if (typeof field.value === 'string' && field.value.endsWith('.')) {
                  field.onChange(field.value.slice(0, -1));
                }
              }}
              fullWidth
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error?.message ?? helperText}
              type="text"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment:
                  unit === 'amount' ? <InputAdornment position="start">₹</InputAdornment> : undefined,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={disabledUnit ? '' : 'Change unit'} arrow>
                      <span>
                        <Button
                          disabled={disabledUnit}
                          size="small"
                          variant="outlined"
                          color="inherit"
                          onClick={handleOpenMenu}
                          aria-haspopup="menu"
                          aria-expanded={Boolean(menuEl)}
                          aria-controls={`${name}-unit-menu`}
                          sx={{
                            minWidth: 0,
                            px: 1,
                            lineHeight: 1.5,
                            textTransform: 'none',
                            borderRadius: 1.25,
                            fontWeight: 600,
                          }}
                        >
                          {unitLabel}
                          {!disabledUnit && (
                            <span aria-hidden="true" style={{ paddingLeft: 4 }}>
                              ▾
                            </span>
                          )}
                        </Button>
                      </span>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]*$',
                autoComplete: 'off',
                onWheel: (e) => e.currentTarget.blur(),
              }}
              {...textFieldProps}
            />
          );
        }}
      />
      {!disabledUnit && (
        <Menu
          id={`${name}-unit-menu`}
          open={Boolean(menuEl)}
          anchorEl={menuEl}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {unitOptions.map((opt) => (
            <MenuItem
              key={opt.value}
              selected={opt.value === unit}
              onClick={() => handleSelectUnit(opt.value)}
            >
              {opt.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
}
