import PropTypes from "prop-types";

import { Box, Typography } from "../";

function QTitleBox({ children, titulo, ...props }) {
  return (
    <Box mb={1} {...props}>
      <Box>
        <Typography variant="overline">{titulo}</Typography>
      </Box>
      {children}
    </Box>
  );
}

QTitleBox.propTypes = {
  children: PropTypes.any,
  titulo: PropTypes.string,
};

QTitleBox.defaultProps = {};

export default QTitleBox;
