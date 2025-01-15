import PropTypes from "prop-types";
import { ACL } from "quimera/lib";

function Can({ children, rule, rules }) {
  console.log("CAN::::", rule, rules);
  const permissionRules = [...(rules ?? []), ...(rule ? [rule] : [])];

  return (
    permissionRules
      .map(permissionRule => (permissionRule ? ACL.can(permissionRule) : true))
      .some(can => !!can) && children
  );
}

Can.propTypes = {
  /** Rule for  */
  rule: PropTypes.string,
  rules: PropTypes.array,
};

Can.defaultProps = {};

export default Can;
