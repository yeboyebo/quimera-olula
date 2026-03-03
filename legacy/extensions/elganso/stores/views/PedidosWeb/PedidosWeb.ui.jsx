/* eslint-disable prettier/prettier */
import "./PedidosWeb.style.scss";

import Switch from "@mui/material/Switch";
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Button, Container, Dialog, DialogActions, DialogTitle } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, util } from "quimera";
import React, { useEffect } from "react";
import Select from "react-select";

// import { BarcodeScanner } from "../../comps";
import { PedidoWeb } from "../../comps";

function PedidosWeb({ useStyles }) {
  const [state, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "init",
      payload: {
        codTienda: util.getUser().codtienda
      },
    });
  }, []);

  const { pedidosWeb } = state;
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [filtroSeleccionado, setFiltroSeleccionado] = React.useState(null);
  const [abrirRegularizarFaltante, setDialogoRegularizarFaltante] = React.useState(false);
  const [faltantesRegSeleccionados, setFaltantesRegSeleccionados] = React.useState(false);
  const [abrirMarcarEnviadosError, setAbrirMarcarEnviadosError] = React.useState(false);
  const [pedidosMarcarEnviadosError, setPedidosMarcarEnviadosError] = React.useState();

  const groupBy = key => array =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = obj[key];
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);

      return objectsByKeyValue;
    }, {});

  const groupIdtpvComanda = groupBy("idtpv_comanda");
  const groupById = groupBy("id");

  const lineasAgrupadasPorPedido = groupIdtpvComanda(pedidosWeb);
  const lineasAgrupadasPorId = groupById(pedidosWeb);

  const filtroLineas = lineas => {
    let lineasFiltradas = null;
    let lineasFiltradasAux = null;
    switch (filtroSeleccionado) {
      case 7:
        // "TODOS"
        //lineasFiltradas = lineas;
        setFiltroSeleccionado(null);

        break;
      case 1:
        // "POR PREPARAR"
        lineasFiltradasAux = lineas.filter(
          obj => obj.pedidopreparado === true,
        );
        if (lineasFiltradasAux.length === lineas.length) {
          lineasFiltradas = [];
        } else {
          lineasFiltradas = lineas;
        }
        lineasFiltradasAux = null;

        break;
      case 2:
        // "PENDIENTE TRANSPORTISTA"
        lineasFiltradasAux = lineas.filter(
          obj => obj.pedidopreparado === true && obj.pedidoenviado === false && obj.url === null && !obj.etiquetaimpresa,
        );
        if (lineasFiltradasAux.length === lineas.length) {
          lineasFiltradas = lineas;
        } else {
          lineasFiltradas = [];
        }
        lineasFiltradasAux = null;

        break;
      case 3:
        // "PENDIENTE IMPRIMIR"
        lineasFiltradasAux = lineas.filter(
          obj => obj.pedidopreparado === true && obj.pedidoenviado === false && obj.url !== null && !obj.etiquetaimpresa,
        );
        if (lineasFiltradasAux.length === lineas.length) {
          lineasFiltradas = lineas;
        } else {
          lineasFiltradas = [];
        }
        lineasFiltradasAux = null;

        break;
      case 4:
        // "PENDIENTE MARCAR ENVIADO"
        lineasFiltradasAux = lineas.filter(
          obj => obj.pedidopreparado === true && obj.pedidoenviado === false && (obj.url !== null || obj.recogidatienda && obj.codalmacen === obj.codtiendarecogida) && obj.etiquetaimpresa,
        );
        if (lineasFiltradasAux.length === lineas.length) {
          lineasFiltradas = lineas;
        } else {
          lineasFiltradas = [];
        }
        lineasFiltradasAux = null;

        break;
      case 5:
        // "RECOGIDA EN TIENDA"
        lineasFiltradasAux = lineas.filter(
          obj => obj.recogidatienda && obj.codalmacen === obj.codtiendarecogida,
        );
        if (lineasFiltradasAux.length === lineas.length) {
          lineasFiltradas = lineas;
        } else {
          lineasFiltradas = [];
        }
        lineasFiltradasAux = null;

        break;
      default:
        // "DEFAULT"
        break;
    }

    return lineasFiltradas;
  };

  const pedidosProcesados = lineasAgrupadas => {
    const pedidos = [];
    const keys = Object.keys(lineasAgrupadas);
    keys.forEach(key => {
      const pedido = {};
      pedido["idtpv_comanda"] = lineasAgrupadas[key][0]["idtpv_comanda"];
      pedido["fecha"] = lineasAgrupadas[key][0]["fecha"];
      pedido["hora"] = lineasAgrupadas[key][0]["hora"];
      pedido["codcomanda"] = lineasAgrupadas[key][0]["codcomanda"];
      pedido["pedidopreparado"] = lineasAgrupadas[key][0]["pedidopreparado"];
      pedido["etiquetaimpresa"] = lineasAgrupadas[key][0]["etiquetaimpresa"];
      pedido["pedidoenviado"] = lineasAgrupadas[key][0]["pedidoenviado"];
      pedido["regalo"] = lineasAgrupadas[key][0]["regalo"];
      pedido["mg_codpostalenv"] = lineasAgrupadas[key][0]["mg_codpostalenv"];
      pedido["recogidatienda"] = lineasAgrupadas[key][0]["recogidatienda"];
      pedido["codtiendarecogida"] = lineasAgrupadas[key][0]["codtiendarecogida"];
      pedido["cliente"] = lineasAgrupadas[key][0]["cliente"];
      pedido["direccion"] = lineasAgrupadas[key][0]["direccion"];
      pedido["mg_ciudadenv"] = lineasAgrupadas[key][0]["mg_ciudadenv"];
      pedido["mg_provinciaenv"] = lineasAgrupadas[key][0]["mg_provinciaenv"];
      pedido["mg_paisenv"] = lineasAgrupadas[key][0]["mg_paisenv"];
      pedido["iddirectorder"] = lineasAgrupadas[key][0]["iddirectorder"];
      pedido["codalmacen"] = lineasAgrupadas[key][0]["codalmacen"];
      pedido["packaging"] = lineasAgrupadas[key][0]["packaging"];
      pedido["lineas"] = lineasAgrupadas[key];
      pedido["lineasFiltradas"] = filtroLineas(lineasAgrupadas[key]);
      pedido["totalLineas"] = lineasAgrupadas[key].length;
      pedido["totalFaltantes"] = lineasAgrupadas[key].filter(
        obj => obj.faltantecreada === true,
      ).length;
      pedido["totalAnuladas"] = lineasAgrupadas[key].filter(
        obj => obj.pedidoanulado === true,
      ).length;
      pedido["totalEnviado"] = lineasAgrupadas[key].filter(
        obj => obj.pedidoenviado === true,
      ).length;
      pedido["totalImpreso"] = lineasAgrupadas[key].filter(
        obj => obj.etiquetaimpresa === true,
      ).length;
      pedido["totalPreparado"] = lineasAgrupadas[key].filter(
        obj => obj.pedidopreparado === true,
      ).length;
      pedido["totalEscaneado"] = lineasAgrupadas[key].filter(
        obj => obj.barcodeescaneado === true,
      ).length;
      pedido["totalEtiquetaAsignada"] = lineasAgrupadas[key].filter(obj => obj.url !== null).length;
      pedido["etiquetaUrl"] = null;
      if (lineasAgrupadas[key].filter(obj => obj.url !== null).length > 0) {
        pedido["etiquetaUrl"] = lineasAgrupadas[key].filter(obj => obj.url !== null)[0]["url"];
      }

      // Si el pedido no tiene filtro o si teniendolo tiene lineas se añade
      if (!Array.isArray(pedido["lineasFiltradas"]) || pedido["lineasFiltradas"].length > 0) {
        pedidos.push(pedido);
      }
    });

    return pedidos;
  };

  const renderPedido = params => {
    // eslint-disable-next-line camelcase
    const { idtpv_comanda } = params.row;
    const { abrirDialogoFaltante } = state;

    return (
      <PedidoWeb
        pedido={params}
        expanded={rowSelectionModel.includes(idtpv_comanda) ? true : false}
        setFiltroSeleccionado={setFiltroSeleccionado}
        abrirDialogoFaltante={abrirDialogoFaltante}
      />
    );
  };

  const columns = [
    {
      field: "codcomanda",
      headerName: "PEDIDO",
      sortable: false,
      flex: 0.9,
      resizable: false,
      renderCell: params => renderPedido(params),
    },
  ];

  const colorsArray = [
    { value: 1, label: "POR PREPARAR", color: "lightgrey" },
    { value: 2, label: "PENDIENTE TRANSPORTISTA", color: "#a5c3f7" },
    { value: 3, label: "PENDIENTE IMPRIMIR", color: "#a5c3f7" },
    { value: 4, label: "PENDIENTE MARCAR ENVIADO", color: "#c94aff" },
    { value: 5, label: "RECOGIDA EN TIENDA", color: "#80ac80" }
  ];
  const valueFromId = (opts, id) => opts.find(o => o.value === id);

  const CustomToolbar = () => {
    const { pedidosWeb } = state;

    const pedidosPorEnviar = pedidosWeb.filter(function (linea) {
      return rowSelectionModel.indexOf(linea.idtpv_comanda) !== -1;
    });

    let pedidosPorEnviarGrouped = null;
    const pedidosErroneos = [];

    const colorStyles = {
      control: (styles, state) => ({
        ...styles,
        background: '#fff',
        borderColor: '#9e9e9e',
        minHeight: '30px',
        height: '30px',
        boxShadow: state.isFocused ? null : null,
      }),

      valueContainer: (styles, state) => ({
        ...styles,
        height: '30px',
        lineHeight: '24px',
        padding: '0 6px',
      }),

      input: (styles, state) => ({
        ...styles,
        margin: '0px',
      }),
      indicatorSeparator: state => ({
        display: 'none',
      }),
      indicatorsContainer: (styles, state) => ({
        ...styles,
        height: '30px',
      }),

      option: (styles, { data }) => {
        return {
          ...styles,
          backgroundColor: data.color
        };
      },

      singleValue: (styles, { data }) => {
        return {
          ...styles,
          padding: '0 5px',
          backgroundColor: data.color
        };
      },
    };

    const handleChangeFiltro = (e) => {
      if (e.value) {
        setFiltroSeleccionado(e.value);
      }
    }

    return (
      <GridToolbarContainer className="toolbarContainer">
        <div className="toolbarContainer-subcontainer">
          <GridToolbarQuickFilter className="toolbarContainer-quickFilter" />
          <div className="row-Filtros">
            <Select
              defaultValue={valueFromId(colorsArray, filtroSeleccionado)}
              options={colorsArray}
              styles={colorStyles}
              placeholder="Filtrar"
              value={valueFromId(colorsArray, filtroSeleccionado)}
              onChange={handleChangeFiltro}
            />
          </div>
        </div>
        <Button
          id="buttonPedidosEnviados"
          className="buttonPedidosEnviados"
          text="Marcar Pedidos Como Enviados"
          variant="outlined"
          onClick={() => {
            if (pedidosPorEnviar.length > 0) {
              pedidosPorEnviarGrouped = groupIdtpvComanda(pedidosPorEnviar);

              Object.keys(pedidosPorEnviarGrouped).forEach(key => {
                pedidosPorEnviarGrouped[key].every(linea => {
                  if (!linea.etiquetaimpresa) {
                    pedidosErroneos.push(linea.codcomanda);

                    return false;
                  }

                  return true;
                });
              });
              if (rowSelectionModel.length > 0) {
                if (pedidosErroneos.length > 0) {
                  setPedidosMarcarEnviadosError(pedidosErroneos);
                  setAbrirMarcarEnviadosError(true);
                } else {
                  Object.keys(pedidosPorEnviarGrouped).forEach(key => {
                    dispatch({
                      type: "onMarcarComoEnviado",
                      payload: {
                        codcomanda: pedidosPorEnviarGrouped[key][0]["codcomanda"],
                      },
                    });
                  });
                }
              }
            }
          }}
        />
      </GridToolbarContainer>
    );
  };

  const handleChangeSwitch = (event, idLinea) => {
    const { faltantesRegularizar } = state;
    if (event.target.checked) {
      if (faltantesRegularizar.indexOf(idLinea) === -1) {
        faltantesRegularizar.push(idLinea);
      }
    } else if (faltantesRegularizar.indexOf(idLinea) !== -1) {
      faltantesRegularizar.splice(faltantesRegularizar.indexOf(idLinea), 1);
    }
    setFaltantesRegSeleccionados(faltantesRegularizar.length);
  };

  const render = () => {
    const {
      abrirDialogoFaltante,
      dialogFaltanteTitle,
      faltantesSeleccionados,
      faltantesRegularizar,
    } = state;

    return (
      <>
        {/* <BarcodeScanner /> */}
        <DataGrid
          rows={pedidosProcesados(lineasAgrupadasPorPedido)}
          disableAutosize
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableColumnMenu
          disableRowSelectionOnClick
          checkboxSelection
          onRowSelectionModelChange={newRowSelectionModel => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          columns={columns}
          slots={{ toolbar: CustomToolbar }}
          localeText={{
            toolbarQuickFilterPlaceholder: "Buscar...",
          }}
          getRowId={row => row.idtpv_comanda}
          getRowClassName={params => {
            return "rowPedido";
          }}
          getRowHeight={() => "auto"}
          sx={{
            ".MuiDataGrid-virtualScroller::-webkit-scrollbar": { display: "none" },
          }}
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
          <Dialog open={abrirDialogoFaltante} fullWidth maxWidth="md">
            <DialogTitle id="form-dialog-title">{dialogFaltanteTitle}</DialogTitle>
            <DialogActions className="pedidosWebDialogAction">
              <div>
                <Button
                  id="marcarFaltanteDenegar"
                  text="No"
                  className="modalButton"
                  onClick={() => {
                    dispatch({
                      type: "dialogoFaltanteClose",
                    });
                  }}
                />
                <Button
                  id="marcarFaltanteAcceptar"
                  text="Sí"
                  className="modalButton"
                  onClick={() => {
                    setDialogoRegularizarFaltante(true);
                  }}
                />
              </div>
            </DialogActions>
          </Dialog>
        </Container>

        <Container>
          <Dialog open={abrirRegularizarFaltante} fullWidth maxWidth="md">
            <DialogTitle id="form-dialog-title">¿REGULARIZAR FALTANTES?</DialogTitle>
            <div>
              {faltantesSeleccionados.map(idLinea => (
                <div className="rowRegularizarFaltantes">
                  <div className="regularizarFaltantesDescripcion">
                    <div className="descripcion">
                      {lineasAgrupadasPorId[idLinea][0]["descripcion"]}
                    </div>
                    <div>
                      {lineasAgrupadasPorId[idLinea][0]["referencia"]}
                      {lineasAgrupadasPorId[idLinea][0]["talla"] !== "TU"
                        ? `- ${lineasAgrupadasPorId[idLinea][0]["talla"]}`
                        : null}
                    </div>
                  </div>
                  <div className="regularizarFaltantesAcciones">
                    <Switch
                      id={`switchRegularizar-${idLinea}`}
                      onChange={e => {
                        handleChangeSwitch(e, idLinea);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <DialogActions className="pedidosWebDialogAction">
              <div>
                <Button
                  id="cancelarAvisoFaltante"
                  text="Cancelar"
                  className="modalButtonCancelar"
                  onClick={() => {
                    setDialogoRegularizarFaltante(false);
                    setFaltantesRegSeleccionados(false);
                    dispatch({
                      type: "dialogoFaltanteClose",
                    });
                  }}
                />
                <Button
                  id="aceptarAvisoFaltante"
                  text="Omitir"
                  className="modalButton"
                  onClick={() => {
                    faltantesSeleccionados.forEach(idLinea => {
                      dispatch({
                        type: "onMarcarComoFaltante",
                        payload: {
                          id: idLinea,
                        },
                      });
                    });
                    setDialogoRegularizarFaltante(false);
                    setFaltantesRegSeleccionados(false);
                    dispatch({
                      type: "dialogoFaltanteClose",
                    });
                  }}
                />
                <Button
                  id="aceptarAvisoFaltante"
                  text="Regularizar"
                  className={
                    faltantesRegSeleccionados ? "modalButton" : "modalButton modalButton-NoActivo"
                  }
                  onClick={() => {
                    if (faltantesRegSeleccionados) {
                      faltantesSeleccionados.forEach(idLinea => {
                        dispatch({
                          type: "onMarcarComoFaltante",
                          payload: {
                            id: idLinea,
                          },
                        });
                      });
                      setDialogoRegularizarFaltante(false);
                      setFaltantesRegSeleccionados(false);
                      dispatch({
                        type: "marcarFaltantesRegularizados",
                        payload: {
                          faltantesRegularizar: JSON.stringify(faltantesRegularizar),
                        },
                      });
                      dispatch({
                        type: "dialogoFaltanteClose",
                      });
                    }
                  }}
                />
              </div>
            </DialogActions>
          </Dialog>
        </Container>

        <Container>
          <Dialog open={abrirMarcarEnviadosError} fullWidth maxWidth="md">
            <div className="pedidosEnviadosError-Title">
              Existen pedidos con lineas sin resolver.
            </div>
            <div className="pedidosEnviadosError-Wrapper">
              <div>Pedidos afectados: </div>
              {pedidosMarcarEnviadosError
                ? pedidosMarcarEnviadosError.map(pedido => (
                  <div className="pedidosEnviadosError">{pedido}</div>
                ))
                : null}
            </div>
            <DialogActions>
              <div>
                <Button
                  id="cerrarAvisoError"
                  text="Cerrar"
                  className="modalButton"
                  onClick={() => {
                    setPedidosMarcarEnviadosError([]);
                    setAbrirMarcarEnviadosError(false);
                  }}
                />
              </div>
            </DialogActions>
          </Dialog>
        </Container>
        {filtroSeleccionado ? (
          <>
            <div className="filtrosFooter-container"></div>
            <div className="filtrosFooter">
              <div>
                Filtros aplicados:
                <div>
                  <span className={`filtro-footer-selected-${valueFromId(colorsArray, filtroSeleccionado)["value"]}`}>
                    {valueFromId(colorsArray, filtroSeleccionado)["label"]}
                  </span>
                </div>

              </div>
              <Button
                id="limpiarFiltros"
                text="Limpiar"
                className="modalButton-ClearFilter"
                onClick={() => {
                  setFiltroSeleccionado(null);
                }}
              />
            </div>
          </>
        ) : null}
      </>
    );
  };

  return <Quimera.Template id="PedidosWeb">{render()}</Quimera.Template>;
}

PedidosWeb.propTypes = PropValidation.propTypes;
PedidosWeb.defaultProps = PropValidation.defaultProps;
export default PedidosWeb;
