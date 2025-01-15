import { Avatar as AvatarMUI } from "@quimera/thirdparty";
import PropTypes from "prop-types";
import React from "react";

function Avatar({ size, ...props }) {
  return <AvatarMUI alt="" style={{ width: size, height: size }} {...props} />;
}

Avatar.propTypes = {
  /** Avatar's size in css style (50px, 1.4em...) */
  size: PropTypes.string,
};

Avatar.defaultProps = {
  size: "50px",
};

export default Avatar;
