import PropTypes from "prop-types";
import React from "react";

// To do: Chip en quimera-comps con propiedades maxWidth y tooltip
function ChipLabel({ children, maxWidth }) {
  return (
    <div
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth,
      }}
    >
      {children}
    </div>
  );
}

ChipLabel.propTypes = {
  children: PropTypes.any,
  maxWidth: PropTypes.number,
};

ChipLabel.defaultProps = {
  maxWidth: 200,
};

export { ChipLabel };
