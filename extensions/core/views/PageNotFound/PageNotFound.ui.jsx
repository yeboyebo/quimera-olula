import Quimera, { PropValidation } from "quimera";
import React from "react";

function PageNotFound() {
  return (
    <Quimera.Template id="PageNotFound">
      <h1>404 Page Not Found</h1>
    </Quimera.Template>
  );
}

PageNotFound.propTypes = PropValidation.propTypes;
PageNotFound.defaultProps = PropValidation.defaultProps;
export default PageNotFound;
