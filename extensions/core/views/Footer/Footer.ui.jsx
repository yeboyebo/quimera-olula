import Quimera, { PropValidation } from "quimera";
import React from "react";

function Footer() {
  return (
    <Quimera.Template id="Footer">
      <Quimera.Block id="Footertext">
        <footer>{/* Hello! Footer in Template */}</footer>
      </Quimera.Block>
    </Quimera.Template>
  );
}

Footer.propTypes = PropValidation.propTypes;
Footer.defaultProps = PropValidation.defaultProps;
export default Footer;
