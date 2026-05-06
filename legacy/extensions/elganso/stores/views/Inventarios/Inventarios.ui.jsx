import "./Inventarios.style.scss";

import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Icon, IconButton } from "@quimera/comps";
import { navigate } from "hookrouter";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React, { useEffect, useState } from "react";
import { useDbState } from "use-db-state";

import { LoadingGif, YearInCurso } from "../../comps";

const getDbInstance = (dbName, storeName) => {
  return new Promise((resolve, reject) => {
    // const storageVersion = localStorage.getItem("indexDbVersion");
    // const version = storageVersion === null ? 1 : parseInt(storageVersion, 10) + 1;
    // localStorage.setItem("indexDbVersion", version);

    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };

    request.onsuccess = event => {
      resolve(event.target.result);
    };

    request.onerror = event => {
      reject(event.target.error);
    };
  });
};

const getDbValue = async (dbName, storeName, key) => {
  const db = await getDbInstance(dbName, storeName);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(key);

    request.onsuccess = event => {
      resolve(event.target.result ? event.target.result.value : undefined);
    };

    request.onerror = event => {
      reject(event.target.error);
    };
  });
};

function Inventarios() {
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const [state, dispatch] = useStateValue();
  const [filteredYears, setFilteredYears] = useState([]);
  const [inventariosDbIndex, setInventariosDbIndex] = useDbState(
    "inventariosDbIndex",
    "",
    "ElGansoAppInv",
    "Inventarios",
  );
  const [_, setArticulosDbIndex] = useDbState("articulosDbIndex", "", "ElGansoAppArt", "Articulos");

  const { inventarios } = state;

  useEffect(() => {
    // Guardar funcion actualizar datos en un state
    dispatch({
      type: "setIndexDb",
      payload: {
        inventariosDbIndex,
        setInventariosDbIndex,
      },
    });

    let filtroYears = [];
    // Obtener años seleccionados
    getDbValue("ElGansoApp", "Years", "yearsSelected").then(years => {
      if (!years) {
        const y = parseInt(new Date().getYear(), 10) % 100;
        filtroYears.push(y.toString());
      } else {
        filtroYears = years;
      }
      setFilteredYears(filtroYears);

      dispatch({
        type: "setFechaFiltro",
        payload: {
          filtroYears,
        },
      });
    });

    // Obtener inventarios
    getDbValue("ElGansoAppInv", "Inventarios", "inventariosDbIndex").then(inventariosIndexados => {
      setInventariosDbIndex(inventariosIndexados);
      dispatch({
        type: "getInventarios",
        payload: {
          inventariosDbIndex: inventariosIndexados,
        },
      });
    });

    // Obtener articulos
    getDbValue("ElGansoAppArt", "Articulos", "articulosDbIndex").then(articulosIndexados => {
      setArticulosDbIndex(articulosIndexados);
      dispatch({
        type: "getArticulos",
        payload: {
          articulosDbIndex: articulosIndexados,
          setArticulosDbIndex,
        },
      });
    });
  }, [dispatch]);

  const obtenerInventarios = () => {
    dispatch({
      type: "getInventarios",
      payload: {
        inventariosDbIndex: [],
      },
    });
  };

  const render = () => {
    const renderIcon = params => {
      let inv = null;

      if (inventariosDbIndex === undefined) {
        inv = inventarios.find(inv => inv.idinventario === params.row.idinventario);
      } else {
        inv = inventariosDbIndex.find(inv => inv.idinventario === params.row.idinventario);
      }

      if (params.row.enviado === false) {
        if (inv !== undefined && inv.lineasModificadas !== undefined) {
          return (
            <IconButton
              id="button-sincro"
              className="buttonSincro buttonSincro-green"
              title="Sincronizar"
              onClick={() =>
                dispatch({
                  type: "onSincroInventarioClicked",
                  payload: {
                    idInventario: params.row.idinventario,
                    descInventario: params.row.descripcion,
                  },
                })
              }
            >
              <Icon>arrow_circle_up</Icon>
            </IconButton>
          );
        }

        return (
          <div className="buttonSincro buttonSincro-black">
            <Icon title="Pendiente">arrow_circle_up</Icon>
          </div>
        );
      }

      return (
        <div className="buttonSincro">
          <Icon title="Terminado">arrow_circle_up</Icon>
        </div>
      );
    };

    const renderInventarioFecha = params => {
      return (
        <div className="inventarioFecha tableGrid">
          <span>{params.row.fecha}</span>
          <span>{params.row.hora}</span>
        </div>
      );
    };

    const renderAcciones = params => {
      let active = true;
      if (params.row.enviado === true) {
        active = false;
      }

      if (active) {
        return (
          <>
            <IconButton
              id="button-edit"
              className="buttonAcciones buttonAcciones-active"
              title="Editar"
              onClick={() => navigate(`/inventarios/edit/${params.row.idsincro}`)}
            >
              <Icon>mode_edit</Icon>
            </IconButton>
            <IconButton
              id="button-delete"
              className="buttonAcciones buttonAcciones-active"
              title="Eliminar"
              onClick={() => {
                dispatch({
                  type: "onDeleteInventarioClicked",
                  payload: {
                    idInventario: params.row.idinventario,
                    descInventario: params.row.descripcion,
                  },
                });
              }}
            >
              <Icon>delete</Icon>
            </IconButton>
          </>
        );
      }

      return (
        <>
          <div className="buttonAcciones">
            <Icon>mode_edit</Icon>
          </div>
          <div className="buttonAcciones">
            <Icon>delete</Icon>
          </div>
        </>
      );
    };

    function CustomToolbar() {
      return (
        <GridToolbarContainer className="toolbarContainer">
          <YearInCurso className="toolbarContainer-quickFilter" />
          <div className="toolbarContainer-subcontainer">
            <GridToolbarQuickFilter className="toolbarContainer-quickFilter" />
            <IconButton
              id="button-download"
              className="buttonDescargar buttonDescargar-green"
              title="Descargar Inventarios"
              onClick={() =>
                dispatch({
                  type: "descargarInventarios",
                  payload: {
                    inventariosDbIndex,
                    obtenerInventarios,
                  },
                })
              }
            >
              <Icon>sync</Icon>
            </IconButton>
          </div>
        </GridToolbarContainer>
      );
    }

    const columns = [
      {
        field: "idinventario",
        headerName: "",
        renderCell: params => renderIcon(params),
        flex: mobile ? 0.1 : 0.25,
        sortable: false,
      },
      {
        field: "fecha",
        headerName: "Fecha",
        renderCell: params => renderInventarioFecha(params),
        flex: mobile ? 0.45 : 0.5,
      },
      { field: "descripcion", headerName: "Nombre", flex: mobile ? 0.8 : 1.5 },
      {
        field: "acciones",
        headerName: "",
        renderCell: params => renderAcciones(params),
        flex: mobile ? 0.5 : 0.5,
        sortable: false,
      },
    ];

    const inventariosFiltered = [];
    filteredYears.forEach(filteredYear => {
      let inventariosFilteredAux = [];
      const fechaIncio = `20${filteredYear}-01-01`;
      const fechaFin = `20${filteredYear}-12-31`;
      inventariosFilteredAux = inventarios.filter(
        inventarios => inventarios.fecha >= fechaIncio && inventarios.fecha <= fechaFin,
      );
      inventariosFiltered.push(...inventariosFilteredAux);
    });

    if (inventarios.length > 0 && inventariosFiltered.length === 0) {
      return (
        <div id="Inventarios" className="page-container">
          <h2 className="main">Inventarios</h2>
          <div className="text-actualizar">
            No dispone de envios descargados para el año seleccionado
          </div>
          <div className="botonActualizar">
            <IconButton
              id="button-download"
              onClick={() => {
                dispatch({
                  type: "descargarInventarios",
                  payload: {
                    nInventarios: inventariosDbIndex.filter(inv => "lineasModificadas" in inv)
                      .length,
                    obtenerInventarios,
                  },
                });
              }}
            >
              Actualizar
              <Icon className="buttonSincro">sync</Icon>
            </IconButton>
          </div>
        </div>
      );
    }

    return (
      <div id="Inventarios" className="page-container">
        <h2 className="main">Inventarios</h2>
        {inventarios.length > 0 ? (
          <DataGrid
            rows={inventarios}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            disableColumnMenu
            disableRowSelectionOnClick
            columns={columns}
            slots={{ toolbar: CustomToolbar }}
            localeText={{
              toolbarQuickFilterPlaceholder: "Buscar...",
            }}
            getRowId={row => row.idinventario}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                printOptions: { disableToolbarButton: true },
                csvOptions: { disableToolbarButton: true },
              },
              pagination: {
                labelRowsPerPage: "Líneas por página",
                labelDisplayedRows: ({ from, to, count }) => `${from}-${to} de ${count}`,
              },
            }}
          />
        ) : (
          <LoadingGif />
        )}

        <IconButton
          id="nuevoInventario"
          className="buttonNuevoInventario"
          title="Nuevo Inventario"
          onClick={() => {
            navigate("/inventarios/new");
          }}
        >
          <Icon>add_circle</Icon>
        </IconButton>
      </div>
    );
  };

  return <Quimera.Template id="Inventarios">{render()}</Quimera.Template>;
}

Inventarios.propTypes = PropValidation.propTypes;
Inventarios.defaultProps = PropValidation.defaultProps;
export default Inventarios;
