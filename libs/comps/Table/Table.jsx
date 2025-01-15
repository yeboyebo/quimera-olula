import { makeStyles } from "@quimera/styles";
import { Box } from "@quimera/thirdparty";
import PropTypes from "prop-types";
import { useAppValue, util } from "quimera";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const useStyles = makeStyles(_theme => ({
  cursorPointer: {
    cursor: "pointer",
  },
  infinite: {
    overflow: "visible !important",
  },
}));

function Table({
  id,
  data,
  idField,
  orderColumn,
  children,
  next,
  hasMore,
  clickMode,
  bgcolorRowFunction,
  schema,
  loader,
  onChange,
  RowRenderer,
  page,
  rows,
  ...props
}) {
  const [appValue] = useAppValue();
  const classes = useStyles();
  const visibleLoading = appValue.environment.inDevelopment();

  // console.log("mimensaje_data", data);

  return (
    <Box
      id="scrollableDiv"
      name={id}
      height="100%"
      overflowX="scroll"
      overflowY="hidden"
      {...props}
    >
      {RowRenderer ? (
        <RowRenderer key={"header"} schema={schema} isHeader={true} />
      ) : (
        <div
          key="header"
          style={{
            alignItems: "center",
            display: "flex",
            position: "sticky",
            top: "0",
            zIndex: "1",
            // backgroundColor: 'white'
          }}
          className={classes.header}
        >
          {children.map(column =>
            React.cloneElement(column, {
              key: column.props.id,
              isHeader: true,
              tableName: id,
              orderColumn,
              schema,
              value: null,
            }),
          )}
        </div>
      )}
      <InfiniteScroll
        dataLength={data.length}
        next={next}
        hasMore={hasMore}
        loader={visibleLoading && (loader || <h4>Loading...</h4>)}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b></b>
          </p>
        }
        className={classes.infinite}
      // scrollableTarget='scrollableDiv'
      // Quitar scrollableTarget='scrollableDiv' para que depende del scroll principal de la pantalla
      >
        <div id={`${id}Body`}>
          {RowRenderer
            ? data.map((row, idx) => (
              <RowRenderer
                key={row[idField]}
                schema={schema}
                rowData={row}
                index={page && rows ? page * rows + idx : idx}
              />
            ))
            : data.map((rowData, idx, arr) => (
              <Box
                alignItems="center"
                display="flex"
                alignContent="baseline"
                key={rowData[idField]}
                minHeight={40}
                bgcolor={bgcolorRowFunction ? bgcolorRowFunction(rowData) : null}
                // onClick={() => dispatch({ type: `on${util.camelId(id)}RowClicked`, payload: rowData })}
                className={bgcolorRowFunction ? classes.cursorPointer : null}
              >
                {children.map(column => {
                  return React.cloneElement(column, {
                    key: `${rowData[idField]}${util.camelId(column.props.id)}`,
                    tableName: id,
                    data: rowData,
                    clickMode,
                    schema,
                    index: idx,
                    array: arr,
                  });
                })}
              </Box>
            ))}
        </div>
      </InfiniteScroll>
    </Box>
  );
}

Table.propTypes = {
  /** Indica si el clic en una celda llama a una función global de la fila o a una función particular de la columna. Los posibles valores son:
   * line: llama a on + (nombreTabla) + RowClicked
   * (otro valor): llama a on + (nombreTabla) + (nombreColumna) + Clicked
   */
  clickMode: PropTypes.string,
  /** Internal id for component instance reference */
  id: PropTypes.string.isRequired,
  /** Data table rows */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** Field id of the ID column */
  idField: PropTypes.string,
  /** TableColumn instances for data row visualization */
  children: PropTypes.arrayOf(PropTypes.element),
  /** Dict with current ordered column ('field' key) and ordering direction ('direction' key) */
  orderColumn: PropTypes.object,
  /** Next func for pagination */
  next: PropTypes.func,
  /** Whether if it has more records to show */
  hasMore: PropTypes.bool,
  /** Schema for type validation */
  schema: PropTypes.object,
  /**  */
  /** Change the row bgcolor with a function */
  bgcolorRowFunction: PropTypes.func,
  loader: PropTypes.any,
};

Table.defaultProps = {
  idField: "id",
  children: [],
  hasMore: false,
  clickMode: "cell",
};

export default Table;
