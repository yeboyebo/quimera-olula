import BaseField from "../BaseField";
import SwitchField from "./SwitchField";

function SwitchBase({ id, ...props }) {
  return <BaseField id={id} className={""} Component={<SwitchField id={id} />} {...props} />;
}

SwitchBase.propTypes = {};
SwitchBase.defaultProps = {};

export default SwitchBase;
