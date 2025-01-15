import PropTypes from "prop-types";
import React from "react";

import { Field } from "../";

function TextArea({ minRows, ...props }) {
  return <Field.Text multiline minRows={minRows} variant="filled" {...props} />;
}

TextArea.propTypes = {
  /** Number of rows to render */
  minRows: PropTypes.string,
};

TextArea.defaultProps = {
  minRows: "4",
};

export default TextArea;
