import { AdapterDateFns, LocalizationProvider } from "@quimera/thirdparty";
import { util } from "quimera";

import BaseField from "../BaseField";
import TimeField from "./TimeField";

function TimeBase({ timePickerProps = {}, ...props }) {
  const locale = util.getLocaleDateFNS();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
      <BaseField Component={<TimeField {...timePickerProps} />} {...props} />
    </LocalizationProvider>
  );
}

export default TimeBase;
