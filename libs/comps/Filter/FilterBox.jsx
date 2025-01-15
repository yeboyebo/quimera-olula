import { FilterProvider, useStateValue, util } from "quimera";
import { useEffect, useState } from "react";

import { Box, ClearFilterButton, FilterButton, QSection } from "..";

/*
Funcionamiento:
*/

function FilterBox({
  id,
  initialFilter = {},
  externalFilter = null,
  schema,
  auto = false,
  children,
  open,
  title,
  lastFilter = false,
  ...props
}) {
  const lastFilterValue = util.getLastFilter(util.camelId(id));
  const filtroGuardado = lastFilter && lastFilterValue ? lastFilterValue : initialFilter;
  const [filter, setFilter] = useState(filtroGuardado);
  const [, dispatch] = useStateValue();

  const hacerYAplicarFiltro = opciones => {
    const filterNew = [];
    if (opciones && Object.keys(opciones).length !== 0 && lastFilter) {
      console.log("pasa", opciones, lastFilter);
      // Object.entries(opciones).forEach(([key, value]) => {
      //   filterNew.push(value.filter);
      // });
      // dispatch({
      //   type: `on${util.camelId(id)}Changed`,
      //   payload: {
      //     field: util.camelId(id),
      //     value: { "and": filterNew },
      //     type: "publishFilter",
      //     cantFilter: 1
      //   },

      // });
    } else if (lastFilter) {
      console.log("------------------");
      dispatch({
        type: `get${util.camelId(id.split(".")[0])}`,
      });
    }
  };

  const publishFilter = () => {
    util.setLastFilter(util.camelId(id), filter);
    const valoresFiltro = [...Object.values(filter)];
    externalFilter?.length && externalFilter.map(filtro => valoresFiltro.push(filtro));
    dispatch({
      type: `on${util.camelId(id)}Changed`,
      payload: {
        field: util.lastStateField(id),
        value: valoresFiltro.length
          ? {
            and: valoresFiltro?.reduce(
              (accum, item) => [
                ...accum,
                ...(item.filter.or !== undefined || typeof item.value !== "object"
                  ? [item.filter]
                  : item.filter),
              ],
              [],
            ),
          }
          : null,
        cantFilter:
          Object.values(filter).length -
          Object.values(initialFilter).length -
          externalFilter?.length,
        type: "publishFilter",
      },
    });
  };

  const clearFilter = () => {
    util.setLastFilter(util.camelId(id), {});
    const valoresFiltro = [];
    externalFilter?.length && externalFilter.map(filtro => valoresFiltro.push(filtro));
    setFilter({});
    dispatch({
      type: `on${util.camelId(id)}Changed`,
      payload: {
        field: util.lastStateField(id),
        // value: {},
        value: valoresFiltro.length
          ? {
            and: valoresFiltro?.reduce(
              (accum, item) => [
                ...accum,
                ...(item.filter.or !== undefined || typeof item.value !== "object"
                  ? [item.filter]
                  : item.filter),
              ],
              [],
            ),
          }
          : {},
        type: "clearFilter",
      },
    });
  };

  const addFilter = (id, newFilter) => {
    setFilter(filter => ({
      ...filter,
      [id]: newFilter,
    }));
  };

  const removeFilter = id => {
    setFilter(filter => {
      const myFilter = { ...filter };
      delete myFilter[id];

      return myFilter;
    });
  };

  useEffect(() => {
    !!auto && publishFilter();
  }, [auto, filter, dispatch]);

  useEffect(() => {
    const filtroGuardado = util.getLastFilter(util.camelId(id));
    Object.keys(filter).length && publishFilter();
    console.log("hola mundo");
    hacerYAplicarFiltro(filtroGuardado);
  }, []);

  useEffect(() => {
    !!externalFilter && publishFilter();
  }, [externalFilter]);

  return (
    <QSection
      actionPrefix={util.camelId(id)}
      title={title && title}
      focusStyle="button"
      activation={{
        active: open,
      }}
      p={2}
      dynamicComp={() => (
        <>
          <FilterProvider
            value={[
              {
                filter,
                schema,
              },
              addFilter,
              removeFilter,
            ]}
          >
            {children}
          </FilterProvider>
          <Box
            display="flex"
            justifyContent="flex-end"
            style={{ gap: "1em", margin: "20px 0px 0px" }}
          >
            <ClearFilterButton onClick={clearFilter} variant="outlined" />
            {!auto && <FilterButton id="filterBoxfilterButton" onClick={publishFilter} />}
          </Box>
        </>
      )}
      cancel={{
        display: "none",
      }}
      save={{
        display: "none",
      }}
      {...props}
    />
  );
}

FilterBox.propTypes = {};

FilterBox.defaultProps = {};

export default FilterBox;
