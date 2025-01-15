import Slide from "@material-ui/core/Slide";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import PropTypes from "prop-types";
import React from "react";

function HideOnScroll({ children }) {
  // const { children, window } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  // const trigger = useScrollTrigger({ target: window ? window() : undefined })
  // const trigger = useScrollTrigger({ target: window || undefined })
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
};

HideOnScroll.defaultProps = {};

export default HideOnScroll;
