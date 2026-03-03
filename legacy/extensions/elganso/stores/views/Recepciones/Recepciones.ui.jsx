import "./Recepciones.style.scss";

import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Field,
  Icon,
  IconButton,
} from "@quimera/comps";
import { navigate } from "hookrouter";
import Quimera, { PropValidation, useStateValue, util } from "quimera";
import React, { useEffect, useState } from "react";
import { useDbState } from "use-db-state";

import { YearInCurso } from "../../comps";

const getDbInstance = (dbName, storeName) => {
  return new Promise((resolve, reject) => {
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
function Recepciones() {
  const usuario = util.getUser();
  const [recepcionesIndexados, setRecepcionesIndexados] = useState([]);
  const [filteredYears, setFilteredYears] = useState([]);
  const [state, dispatch] = useStateValue();
  const [recepcionesDbIndex, setRecepcionesDbIndex] = useDbState(
    "recepcionesDbIndex",
    "",
    "ElGansoApp3",
    "Recepciones",
  );

  useEffect(() => {
    let filtroYears = [];
    getDbValue("ElGansoApp", "Years", "yearsSelected").then(years => {
      if (!years) {
        const y = parseInt(new Date().getYear(), 10) % 100;
        filtroYears.push(y.toString());
      } else {
        filtroYears = years;
      }
      setFilteredYears(filtroYears);
    });
    getDbValue("ElGansoApp3", "Recepciones", "recepcionesDbIndex").then(recepcionesIndexados => {
      setRecepcionesIndexados(recepcionesIndexados);
      dispatch({
        type: "init",
        payload: {
          codalmadestinoFiltro: usuario.codtienda,
          recepcionesDbIndex: recepcionesIndexados,
          setRecepcionesDbIndex,
          anyos: JSON.stringify(filtroYears),
        },
      });
    });
  }, [dispatch]);

  const {
    recepciones,
    abrirDialogo,
    abrirDialogoSincro,
    dialogTitle,
    idViaje,
    abrirDialogoObtenerRecepciones,
    mostrarSoloMisRecepciones,
  } = state;

  const render = () => {
    const renderIcon = params => {
      const active = false;
      if (
        params.row.usuariorecepcion === usuario.user &&
        "lineasModificadas" in params.row &&
        usuario.codtienda === params.row.codalmadestino
      ) {
        return (
          <IconButton
            id="button-sincro"
            className="buttonSincro buttonSincro-green"
            onClick={() =>
              dispatch({
                type: "onSincroViajeClicked",
                payload: {
                  idViaje: params.row.idviajemultitrans,
                  usuarioEnvio: usuario.user,
                },
              })
            }
          >
            <Icon>arrow_circle_up</Icon>
          </IconButton>
        );
      }
      if (params.row.usuariorecepcion === usuario.user) {
        return (
          <IconButton id="button-sincro" className="buttonSincro buttonSincro-black">
            <Icon>arrow_circle_up</Icon>
          </IconButton>
        );
      }

      return (
        <div className="buttonSincro">
          <Icon>arrow_circle_up</Icon>
        </div>
      );
    };

    const renderViajeName = params => {
      return (
        <div className="viajeName tableGrid">
          <span>{params.row.nombredestino}</span>
          <span>{params.row.idviajemultitrans}</span>
        </div>
      );
    };

    const renderAcciones = params => {
      let active = false;
      if (params.row.usuariorecepcion === usuario.user) {
        active = true;
      }

      if (active) {
        return (
          <IconButton
            id="button-edit"
            className="buttonAcciones buttonAcciones-active"
            onClick={() => navigate(`/editrecepcion/${params.row.idviajemultitrans}`)}
          >
            <Icon>mode_edit</Icon>
          </IconButton>
        );
      }
      if (!params.row.usuariorecepcion) {
        return (
          <IconButton
            id="button-edit"
            className="buttonAcciones "
            onClick={() =>
              dispatch({
                type: "onEditViajeClicked",
                payload: {
                  idViaje: params.row.idviajemultitrans,
                  usuarioEnvio: usuario.user,
                },
              })
            }
          >
            <Icon>mode_edit</Icon>
          </IconButton>
        );
      }
    };

    function CustomToolbar() {
      return (
        <GridToolbarContainer className="toolbarContainer">
          <YearInCurso className="toolbarContainer-quickFilter" />
          <Field.CheckBox
            id="mostrarSoloMisRecepciones"
            label="Mis Recepciones"
            checked={mostrarSoloMisRecepciones}
          />
          <div className="toolbarContainer-subcontainer">
            <GridToolbarQuickFilter className="toolbarContainer-quickFilter" />
            <IconButton
              id="button-download"
              className="buttonDescargar buttonDescargar-green "
              onClick={() =>
                dispatch({
                  type: "descargarViajes",
                  payload: {
                    recepcionesDbIndex,
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
        field: "idviajemultitrans",
        headerName: "",
        renderCell: params => renderIcon(params),
        flex: 0.25,
      },
      {
        field: "nombredestino",
        headerName: "VIAJE",
        renderCell: params => renderViajeName(params),
        flex: 2,
      },
      { field: "cantidad", headerName: "UD", flex: 1 },
      { field: "usuariorecepcion", headerName: "USER", flex: 1 },
      {
        field: "acciones",
        headerName: "",
        renderCell: params => renderAcciones(params),
        flex: 0.25,
      },
    ];

    const recepcionesFiltered = [];

    filteredYears.forEach(filteredYear => {
      let recepcionFilteredAux = [];
      const fechaIncio = `20${filteredYear}-01-01`;
      const fechaFin = `20${filteredYear}-12-31`;

      recepcionFilteredAux = recepciones.filter(
        recepcion => recepcion.fecha >= fechaIncio && recepcion.fecha <= fechaFin,
      );

      let recepcionFilteredAuxFinal = [];
      if (mostrarSoloMisRecepciones) {
        recepcionFilteredAuxFinal = recepcionFilteredAux.filter(
          recepcion => recepcion.usuariorecepcion === usuario.user,
        );
      } else {
        recepcionFilteredAuxFinal = recepcionFilteredAux;
      }

      recepcionesFiltered.push(...recepcionFilteredAuxFinal);
    });

    if (recepciones.length > 0 && recepcionesFiltered.length === 0) {
      return (
        <div id="Recepciones" className="page-container">
          <h2 className="main">Recepciones</h2>
          <div className="text-actualizar">
            No dispone de recepciones descargadas para el año seleccionado.
          </div>
          <div className="botonActualizar">
            <IconButton
              id="button-download"
              onClick={() =>
                dispatch({
                  type: "descargarViajes",
                  payload: {
                    recepcionesDbIndex,
                  },
                })
              }
            >
              Actualizar
              <Icon className="buttonSincro">sync</Icon>
            </IconButton>
          </div>
          <Container>
            <Dialog open={abrirDialogoObtenerRecepciones} fullWidth maxWidth="md">
              <DialogTitle id="form-dialog-sincro-title">{dialogTitle}</DialogTitle>
              <DialogActions>
                <div>
                  <Button id="cancelarObtenerEnvios" text="Cancelar" />
                  <Button
                    id="obtenerRecepciones"
                    text="Aceptar"
                    onClick={() => {
                      let filtroYears = [];
                      getDbValue("ElGansoApp", "Years", "yearsSelected").then(years => {
                        if (!years) {
                          const y = parseInt(new Date().getYear(), 10) % 100;
                          filtroYears.push(y.toString());
                        } else {
                          filtroYears = years;
                        }
                        dispatch({
                          type: "init",
                          payload: {
                            codalmadestinoFiltro: usuario.codtienda,
                            recepcionesDbIndex: [],
                            setRecepcionesDbIndex,
                            anyos: JSON.stringify(filtroYears),
                          },
                        });
                      });
                    }}
                  />
                </div>
              </DialogActions>
            </Dialog>
          </Container>
        </div>
      );
    }

    return (
      <div id="Recepciones" className="page-container">
        <h2 className="main">Recepciones</h2>
        <DataGrid
          rows={recepcionesFiltered}
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
          getRowId={row => row.idviajemultitrans}
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

        <Container>
          <Dialog open={abrirDialogo} fullWidth maxWidth="md">
            <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
            <DialogActions>
              <div>
                <Button id="cancelarAsignacion" text="No" />
                <Button
                  id="asignar"
                  text="Sí"
                  onClick={() => {
                    dispatch({
                      type: "onAsignarUsuarioRecepcion",
                      payload: {
                        idviajemultitrans: idViaje,
                        usuariorecepcion: usuario.user,
                        recepciones,
                        setRecepcionesDbIndex,
                        setRecepcionesIndexados,
                      },
                    });
                  }}
                />
              </div>
            </DialogActions>
          </Dialog>

          <Dialog open={abrirDialogoSincro} fullWidth maxWidth="md">
            <DialogTitle id="form-dialog-sincro-title">{dialogTitle}</DialogTitle>
            <DialogActions>
              <div>
                <Button id="cancelarAsignacionSincro" text="No" />
                <Button
                  id="asignarSincro"
                  text="Sí"
                  onClick={() => {
                    dispatch({
                      type: "onSincroRecepcion",
                      payload: {
                        idviajemultitrans: idViaje,
                        usuariorecepcion: usuario.user,
                        recepciones,
                        setRecepcionesDbIndex,
                        setRecepcionesIndexados,
                      },
                    });
                  }}
                />
              </div>
            </DialogActions>
          </Dialog>
          <Dialog open={abrirDialogoObtenerRecepciones} fullWidth maxWidth="md">
            <DialogTitle id="form-dialog-sincro-title">{dialogTitle}</DialogTitle>
            <DialogActions>
              <div>
                <Button id="cancelarObtenerRecepciones" text="Cancelar" />
                <Button
                  id="obtenerRecepciones"
                  text="Aceptar"
                  onClick={() => {
                    let filtroYears = [];
                    getDbValue("ElGansoApp", "Years", "yearsSelected").then(years => {
                      if (!years) {
                        const y = parseInt(new Date().getYear(), 10) % 100;
                        filtroYears.push(y.toString());
                      } else {
                        filtroYears = years;
                      }
                      dispatch({
                        type: "init",
                        payload: {
                          codalmadestinoFiltro: usuario.codtienda,
                          recepcionesDbIndex: [],
                          setRecepcionesDbIndex,
                          anyos: JSON.stringify(filtroYears),
                        },
                      });
                    });
                  }}
                />
              </div>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    );
  };

  return <Quimera.Template id="Recepciones">{render()}</Quimera.Template>;
}

Recepciones.propTypes = PropValidation.propTypes;
Recepciones.defaultProps = PropValidation.defaultProps;
export default Recepciones;
