import PropTypes from "prop-types";
import React from "react";

import TableColumn from "./TableColumn";

/**
 * DecimalColumn
 */
function DecimalColumn({ decimals, ...props }) {
  function formatCellValue(value) {
    return !!value || value === 0
      ? Number(value).toLocaleString("de-DE", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : null;
  }

  return (
    <TableColumn columnType="DecimalColumn" align="right" format={formatCellValue} {...props} />
  );
}

DecimalColumn.propTypes = {
  /** Number of decimals */
  decimals: PropTypes.number,
};

DecimalColumn.defaultProps = {
  decimals: 2,
};

export default DecimalColumn;
