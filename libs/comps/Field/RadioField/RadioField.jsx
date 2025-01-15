import { FormControlLabel, Radio } from "@quimera/thirdparty";
import PropTypes from "prop-types";
import React from "react";

function RadioField({ label, value, checked, ...props }) {
  return <FormControlLabel control={<Radio {...props} />} value={value} label={label} />;
}

RadioField.propTypes = {
  /** Label for the field */
  label: PropTypes.string,
  /** Vale of the field */
  value: PropTypes.any,
  /** Wheter the field is checked or not */
  checked: PropTypes.bool,
};

RadioField.defaultProps = {};

export default RadioField;
