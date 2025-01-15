import { Button as ButtonMUI } from "@quimera/thirdparty";
import PropTypes from "prop-types";

function RawButton({ children, id, text, primary, onClick, ...props }) {
  return (
    <ButtonMUI id={id} onClick={e => onClick && onClick(e)} {...props}>
      {text}
      {children}
    </ButtonMUI>
  );
}

RawButton.propTypes = {
  /** Id for reference */
  id: PropTypes.string.isRequired,
  /** Id for reference */
  children: PropTypes.node,
  /** Text to show inside the button */
  text: PropTypes.any,
  /** Whether is primary or not */
  primary: PropTypes.bool,
};

RawButton.defaultProps = {
  data: null,
  primary: false,
};

export default RawButton;
