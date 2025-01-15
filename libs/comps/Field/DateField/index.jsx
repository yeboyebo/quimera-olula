import DateFnsUtils from "@date-io/date-fns";
// import esLocale from 'date-fns/locale/es'
import { MuiPickersUtilsProvider } from "@quimera/thirdparty";
import PropTypes from "prop-types";
import { useStateValue, util } from "quimera";
import React from "react";

import BaseField from "../BaseField";
import DateField from "./DateField";

function DateBase({ id, field, interval, datePickerProps, ...props }) {
  const [, dispatch] = useStateValue();

  const stateField = field || id;

  const handleChange = event => {
    dispatch({
      type: `on${util.camelId(id)}Changed`,
      payload: { field: util.lastStateField(stateField), value: event.target.value },
    });
    interval &&
      dispatch({
        type: `on${util.camelId(interval)}Changed`,
        payload: { field: interval, value: "" },
      });
  };
  const locale = util.getLocaleDateFNS();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale} /* locale={esLocale} */>
      <BaseField
        id={id}
        field={stateField}
        Component={<DateField {...datePickerProps} />}
        onChange={handleChange}
        {...props}
      />
    </MuiPickersUtilsProvider>
  );
}

DateBase.propTypes = {
  /** Id for reference */
  id: PropTypes.string.isRequired,
  /** Field for state update */
  field: PropTypes.string,
  /** Interval field */
  interval: PropTypes.string,
  /** Props to pass through */
  datePickerProps: PropTypes.object,
};

DateBase.defaultProps = {
  datePickerProps: {},
};

export default DateBase;
