import React from "react";

import TableColumn from "./TableColumn";
/* import { Tooltip } from '@quimera/thirdparty'
import PropTypes from 'prop-types' */

function formatCellValue(value) {
  return value;
}

/**
 * TextColumn
 */
function TextColumn(props) {
  return <TableColumn columnType="TextColumn" align="left" format={formatCellValue} {...props} />;
}

/* function TextColumn ({ data, value, ...props }) {
  return (
    <Tooltip title={formatCellValue(value(data))}>
      <TableColumn align='left' format={ formatCellValue } value={value} data={data} {...props} />
    </Tooltip>
  )
}
TextColumn.propTypes = {
  data: PropTypes.any,
  value: PropTypes.any
} */
export default TextColumn;
