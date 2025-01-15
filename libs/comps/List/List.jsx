import { Divider, List as ListMUI, ListItem } from "@quimera/thirdparty";
import PropTypes from "prop-types";
import React from "react";

/**
 * Default data list for Quimera applications
 */
function List({ id, data, item, idField, ...props }) {
  return (
    <ListMUI style={{ width: "100%" }} {...props}>
      <Divider />
      {data.map((row, idx) => (
        <React.Fragment key={row[idField]}>
          <ListItem>{item(row, idx)}</ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </ListMUI>
  );
}

List.propTypes = {
  /** List id for reference */
  id: PropTypes.string,
  /** List data */
  data: PropTypes.array,
  /** Item to render a record */
  item: PropTypes.any,
  /** id of idField */
  idField: PropTypes.string,
};

List.defaultProps = {};

export default List;
