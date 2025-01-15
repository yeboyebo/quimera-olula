import PropTypes from "prop-types";
import React from "react";

import { TemplateProvider } from "../../contexts";
import { useTemplateValue } from "../../hooks";
import Reference from "../Block/Reference";

/**
 *   Lets you create Block/Reference components for extension/mix system
 */
function Template({ id, children }) {
  const templateValue = useTemplateValue();
  const [Parent, ...rest] = templateValue.parents;
  const references = React.Children.toArray(children).filter(child => child.type === Reference);

  return (
    <TemplateProvider
      value={{
        references: references.concat(templateValue.references),
        parents: rest,
        style: templateValue.style,
        templateProps: templateValue.templateProps,
      }}
    >
      <React.Fragment key={id}>
        {Parent !== undefined && !!references.length ? (
          <Parent useStyles={templateValue.style} {...templateValue.templateProps}>
            {children}
          </Parent>
        ) : (
          children
        )}
      </React.Fragment>
    </TemplateProvider>
  );
}

Template.propTypes = {
  /** Internal id of the template */
  id: PropTypes.string.isRequired,
  /** Children references to pass through */
  children: PropTypes.any,
};

Template.defaultProps = {
  parents: [],
  children: [],
};

export default Template;
