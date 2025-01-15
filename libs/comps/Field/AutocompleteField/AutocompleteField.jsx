import { Autocomplete, TextField } from "@quimera/thirdparty";
import PropTypes from "prop-types";
import React from "react";

function AutocompleteField({
  options,
  value,
  disabled,
  onInputChange,
  fullWidth,
  InputProps,
  onChange,
  noOptionsText,
  getOptionLabel,
  disableClearable,
  renderOption,
  ...props
}) {
  const handleChange = (e, value) => onChange({ ...e, target: { ...e.target, value } });

  return (
    <Autocomplete
      getOptionLabel={option =>
        getOptionLabel ? getOptionLabel(option) : (option.value || option.key?.toString()) ?? ""
      }
      getOptionSelected={option => {
        return option.key === (value?.key ? value.key : value);
      }}
      options={options}
      loading={false}
      autoHighlight
      value={value ?? null}
      onChange={handleChange}
      disabled={disabled}
      disableClearable={disableClearable}
      renderOption={option =>
        renderOption ? renderOption(option) : (option.value || option.key?.toString()) ?? option
      }
      renderInput={params => (
        <TextField
          {...params}
          id=""
          disabled={disabled}
          onChange={onInputChange}
          fullWidth={fullWidth}
          margin="dense"
          InputProps={{
            ...params.InputProps,
            ...InputProps,
          }}
          {...props}
        />
      )}
      noOptionsText={noOptionsText || ""}
    />
  );
}

AutocompleteField.propTypes = {
  /** Label for the field */
  label: PropTypes.string,
  /** Value of the field */
  value: PropTypes.any,
  /** Suggested options */
  options: PropTypes.array,
  /** Function to execute onInputChange */
  onInputChange: PropTypes.func,
  fullWidth: PropTypes.bool,
  variant: PropTypes.string,
  noOptionsText: PropTypes.string,
  InputProps: PropTypes.any,
};

export default AutocompleteField;
