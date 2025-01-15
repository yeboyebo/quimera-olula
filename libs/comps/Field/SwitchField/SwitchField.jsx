import { FormControlLabel, Switch } from "@quimera/thirdparty";
import PropTypes from "prop-types";

function SwitchField({ label, value, checked, onChange, ...props }) {
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
      control={<Switch defaultChecked={checked} onChange={handleCheck} value={value} {...props} />}
      label={label}
    />
  );
}

SwitchField.propTypes = {
  /** Label for the field */
  label: PropTypes.string,
  /** Vale of the field */
  value: PropTypes.any,
  /** Wheter the field is checked or not */
  checked: PropTypes.bool,
  /** Function to trigger when field changes */
  onChange: PropTypes.func,
};

SwitchField.defaultProps = {};

export default SwitchField;
