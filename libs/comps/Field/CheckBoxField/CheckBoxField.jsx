import { Checkbox, FormControlLabel } from "@quimera/thirdparty";
import PropTypes from "prop-types";
import React from "react";

function CheckBoxField({ label, value, checked, onChange, ...props }) {
  function handleCheck(event) {
    return onChange({
      target: {
        value: event.target.checked,
        name: event.target.value,
      },
    });
  }

  return (
    <FormControlLabel
      control={<Checkbox checked={!!checked} onChange={handleCheck} value={value} {...props} />}
      label={label}
    />
  );
}

CheckBoxField.propTypes = {
  /** Label for the field */
  label: PropTypes.string,
  /** Vale of the field */
  value: PropTypes.any,
  /** Wheter the field is checked or not */
  checked: PropTypes.bool,
  /** Function to trigger when field changes */
  onChange: PropTypes.func,
};

CheckBoxField.defaultProps = {};

export default CheckBoxField;
