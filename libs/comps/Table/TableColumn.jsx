import { makeStyles } from "@quimera/styles";
import PropTypes from "prop-types";
import { useStateValue, util } from "quimera";
import React from "react";

import { Box, Icon } from "../";
import TableCell from "./TableCell";

const useStyles = makeStyles(_theme => ({
  headerWithOrder: {
    cursor: "pointer",
  },
}));

function TableColumn({
  align,
  clickMode,
  columnType,
  data,
  dataDrivenProps,
  format,
  isHeader,
  id,
  header,
  height,
  href,
  order,
  orderColumn,
  tableName,
  tooltip,
  value,
  index,
  array,
  ...props
}) {
  const classes = useStyles();
  const [, dispatch] = useStateValue();
  // const dispatch = () => { }

  const orderableColumns = ["TextColumn", "DateColumn"];

  const dataDependentProps = dataDrivenProps ? dataDrivenProps(data) : {};
  const hrefProp = dataDependentProps.href || href;
  const valueProp = dataDependentProps.value || (value ? value(data, index, array) : data[id]);
  const tooltipProp =
    dataDependentProps.tooltip ||
    (columnType === "TextColumn" && !tooltip ? format(valueProp) : tooltip);
  const orderProp = order || (orderableColumns.includes(columnType) && id);

  function handleClick() {
    if (!hrefProp && columnType !== "ActionColumn") {
      clickMode === "line"
        ? dispatch({
            type: `on${util.camelId(tableName)}RowClicked`,
            payload: data,
          })
        : dispatch({
            type: `on${util.camelId(tableName)}${util.camelId(id)}Clicked`,
            payload: data,
          });
    }
  }

  const flexAlign = align === "left" ? "flex-start" : align === "right" ? "flex-end" : align;

  return isHeader ? (
    <TableCell
      isHeader={true}
      align={align}
      onClick={() =>
        dispatch({
          type: `on${util.camelId(tableName)}ColumnClicked`,
          payload: { data: { id, order: orderProp } },
        })
      }
      className={orderProp ? classes.headerWithOrder : ""}
      tooltip={header}
      {...props}
    >
      <Box
        component="div"
        height="2em"
        display="flex"
        justifyContent={flexAlign}
        alignItems="center"
        justify={align}
        width="100%"
      >
        <strong
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {header}
        </strong>
        {orderProp && orderColumn && orderColumn.field === orderProp ? (
          orderColumn.direction === "ASC" ? (
            <Icon fontSize="small">arrow_drop_down</Icon>
          ) : (
            <Icon fontSize="small">arrow_drop_up</Icon>
          )
        ) : null}
      </Box>
    </TableCell>
  ) : (
    <TableCell
      isHeader={false}
      height={height}
      align={align}
      href={href}
      tooltip={tooltipProp}
      onClick={() => handleClick()}
      {...dataDependentProps}
      {...props}
    >
      {format(valueProp)}
    </TableCell>
  );
}

TableColumn.propTypes = {
  /** Cell alignment */
  align: PropTypes.string,
  /** Valor 'line' Llama a una función onNombreTablaRowClicked, valor 'cell' llama a una función onNombreTablaNombreColumnaClicked */
  clickMode: PropTypes.string,
  /** Tipo de la columna (TextColumn, DateColumn, etc.) */
  columnType: PropTypes.string,
  /** Whether the component should render as a header or a cell */
  isHeader: PropTypes.bool,
  /** Header title */
  header: PropTypes.string,
  /** Function that returns cell value */
  value: PropTypes.func,
  /** TableRow data */
  data: PropTypes.object,
  /** Functión que obtiene las propiedades dependientes de los datos. Algunos posibles valores son:
   * value: Valor de la celda, si existe tiene prevalencia sobre la propiedad value
   * href: hiperenlace: si existe tiene prevalencia sobre la propiedad href
   * otras propiedades como bgColor, etc.
   */
  dataDrivenProps: PropTypes.func,
  /** Function that returns formatted cell value. Algunos tipos de celda como Currency o Date tienen un formateo por defecto. */
  format: PropTypes.func,
  /** URL en caso de que la celda tenga un enlace a otra página */
  href: PropTypes.string,
  /** Column unique identifier (key). Suele tomarse el nombre de la clave de los datos relacionada con la columna */
  id: PropTypes.string.isRequired,
  /** Field to order by. Si no se indica y la celda es de tipo Date o Text, se toma el valor de id */
  order: PropTypes.string,
  /** Table's name for reference */
  tableName: PropTypes.string,
  /** Tooltip. Si no se indica y la columna es de tipo texto se toma el valor de la celda */
  tooltip: PropTypes.string,
  /** Meta about column order. Columna sobre la que se está ordenando la tabla actualmente */
  orderColumn: PropTypes.object,
  /** Height of the cell */
  height: PropTypes.string,
};

TableColumn.defaultProps = {
  isHeader: false,
  align: "left",
  format: value => value,
  data: {},
};

export default TableColumn;
