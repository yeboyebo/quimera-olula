import PropTypes from "prop-types";
import React from "react";

import BaseField from "../BaseField";
import RadioField from "./RadioField";
import RadioGroup from "./RadioGroup";

function RadioBase({ id, options, ...props }) {
  return options ? (
    <BaseField id={id} Component={<RadioGroup id={id} options={options} />} {...props} />
  ) : (
    <BaseField id={id} className={""} Component={<RadioField id={id} />} {...props} />
  );
}

RadioBase.propTypes = {
  /** Id for reference */
  id: PropTypes.string.isRequired,
  /** Different options of the field */
  options: PropTypes.array,
};

RadioBase.defaultProps = {};

export default RadioBase;
