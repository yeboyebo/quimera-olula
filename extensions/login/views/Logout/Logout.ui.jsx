import Quimera, { PropValidation, useStateValue } from "quimera";
import { useEffect } from "react";

function Logout() {
  const [, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {},
    });
  }, [dispatch]);

  return <Quimera.Template id="Logout" />;
}

Logout.propTypes = PropValidation.propTypes;
Logout.defaultProps = PropValidation.defaultProps;
export default Logout;
