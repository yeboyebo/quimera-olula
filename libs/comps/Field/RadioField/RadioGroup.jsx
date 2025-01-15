import { FormControl, FormLabel, RadioGroup as RadioGroupMUI } from "@quimera/thirdparty";
import PropTypes from "prop-types";
import React from "react";

import { Field } from "../";

function RadioGroup({ label, options, value, radioProps, labelProps, onChange, ...props }) {
  return (
    <FormControl component="fieldset" {...props}>
      <FormLabel component="legend" {...labelProps}>
        {label}
      </FormLabel>
      <RadioGroupMUI value={value}>
        {options.map(option => (
          <Field.RadioButton
            key={option.value}
            id=""
            label={option.label || null}
            value={option.value}
            checked={option.checked}
            onChange={onChange}
            {...radioProps}
          />
        ))}
      </RadioGroupMUI>
    </FormControl>
  );
}

RadioGroup.propTypes = {
  /** Label for the field */
  label: PropTypes.string,
  /** Vale of the field */
  value: PropTypes.any,
  /** Different options of the field */
  options: PropTypes.array,
  /** Props to pass to the Radio */
  radioProps: PropTypes.object,
  /** Props to pass to the Label */
  labelProps: PropTypes.object,
  /** Function to trigger when field changes */
  onChange: PropTypes.func,
};

RadioGroup.defaultProps = {};

export default RadioGroup;
