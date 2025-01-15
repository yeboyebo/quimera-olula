import PropTypes from "prop-types";
import React from "react";

import TableColumn from "./TableColumn";

function formatCellValue(value) {
  return value;
}

/**
 * ActionColumn
 */
function ActionColumn({ width, ...props }) {
  return (
    <TableColumn
      columnType="ActionColumn"
      align="center"
      px={0}
      format={formatCellValue}
      width={width}
      flexGrow={0}
      {...props}
    />
  );
}

ActionColumn.propTypes = {
  /** Column width value */
  width: PropTypes.number,
};

ActionColumn.defaultProps = {
  width: 36,
};

export default ActionColumn;
