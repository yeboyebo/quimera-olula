import PropTypes from "prop-types";
import React from "react";

import SelectField from "./SelectField";

function SelectBase({ ...props }) {
  return <SelectField {...props} />;
}

SelectBase.propTypes = {
  /** Props to pass through */
  selectprops: PropTypes.object,
};

SelectBase.defaultProps = {
  selectprops: {},
};

export default SelectBase;
