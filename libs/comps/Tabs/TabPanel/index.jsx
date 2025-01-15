import PropTypes from "prop-types";
import React from "react";

import { Box, Typography } from "../../";

function TabPanel({ index, children, value, mobile, ...props }) {
  return (
    <Typography
      component="div"
      role="tabpanel"
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      hidden={value !== index}
      {...props}
    >
      <Box p={mobile ? 0 : 1}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  /** Children */
  children: PropTypes.any,
  /** Index of the current panel */
  index: PropTypes.number,
  /** Value of the tabWidget */
  value: PropTypes.number,
  /* si es para mobil no margenes */
  mobile: PropTypes.bool,
};

TabPanel.defaultProps = {};

export default TabPanel;
