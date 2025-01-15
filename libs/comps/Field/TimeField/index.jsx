import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@quimera/thirdparty";
import PropTypes from "prop-types";
import React from "react";

import BaseField from "../BaseField";
import TimeField from "./TimeField";

function TimeBase({ timePickerProps, ...props }) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <BaseField Component={<TimeField {...timePickerProps} />} {...props} />
    </MuiPickersUtilsProvider>
  );
}

TimeBase.propTypes = {
  /** Props to pass through */
  timePickerProps: PropTypes.object,
};

TimeBase.defaultProps = {
  timePickerProps: {},
};

export default TimeBase;
