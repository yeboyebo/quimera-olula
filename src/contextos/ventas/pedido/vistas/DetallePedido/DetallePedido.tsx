import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../comun/useMaquina.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
import { Pedido } from "../../diseño.ts";
import { pedidoVacio } from "../../dominio.ts";
import { getPedido, patchPedido } from "../../infraestructura.ts";
import "./DetallePedido.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
// import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

import { useContext } from "react";
import { appFactory } from "../../../../app.ts";
import { ContextoError, QError } from "../../../../comun/contexto.ts";
type ParamOpcion = {
  valor: string;
  descripcion?: string
};
export type ValorControl = null | string | ParamOpcion;
type Estado = "defecto";

const TabDatos = appFactory().Ventas.PedidoTabDatos


async function tiriti<Out> (f: () => Out, setError: (error: QError) => void): Promise<Out> {
  try {
    const result = await f();
    return result;
  } catch (error) {
    setError(error as QError);
    throw error;
  }
}

export const DetallePedido = ({
  pedidoInicial = null,
  emitir = () => {},
}: {
  pedidoInicial?: Pedido | null;
  emitir?: EmitirEvento
}) => {
  const params = useParams();

  const { intentar } = useContext(ContextoError);

  const pedidoId = pedidoInicial?.id ?? params.id;
  const titulo = (pedido: Entidad) => pedido.codigo as string;

  const pedido = useModelo(appFactory().Ventas.metaPedido, pedidoVacio);
  const { modelo, init } = pedido;

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        await intentar(() => patchPedido(modelo.id, modelo));
        recargarCabecera();
      },
      CLIENTE_PEDIDO_CAMBIADO: async() => {
        await recargarCabecera();
      }
    },
  }
  const emitirPedido = useMaquina(maquina, 'defecto', () => {});

  const recargarCabecera = async () => {
    const nuevoPedido = await getPedido(modelo.id);
    init(nuevoPedido);
    emitir('PEDIDO_CAMBIADO', nuevoPedido);
  };

  return (
    <Detalle
      id={pedidoId}
      obtenerTitulo={titulo}
      setEntidad={(p) => init(p)}
      entidad={modelo}
      cargar={getPedido}
    >
      {!!pedidoId && (
        <>
          <Tabs
            children={[
              <Tab key="tab-1"label="Cliente" children={
                  <TabCliente
                  pedido={pedido}
                    publicar={emitirPedido}
                  />
                }
              />,
              <Tab key="tab-2" label="Datos" children={
                  <TabDatos
                  pedido={pedido}
                  />
                }
              />,
              <Tab key="tab-3" label="Observaciones" children={
                  <TabObservaciones 
                    pedido={pedido}
                  />
                }
              />,
            ]}
          ></Tabs>
          { pedido.modificado && (
            <div className="botones maestro-botones ">
              <QBoton
                onClick={() => emitirPedido('GUARDAR_INICIADO')}
                deshabilitado={!pedido.valido}
              >
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={() => init()}
              >
                Cancelar
              </QBoton>
            </div>
          )}

          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
                Neto:
              </label>
              <span>
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "EUR",
                }).format(Number(modelo.neto ?? 0))}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
                Total IVA:
              </label>
              <span>
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "EUR",
                }).format(Number(modelo.total_iva ?? 0))}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
                Total:
              </label>
              <span>
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: String(modelo.coddivisa ?? "EUR"),
                }).format(Number(modelo.total ?? 0))}
              </span>
            </div>
          </div>
          <Lineas
            pedido={pedido}
            onCabeceraModificada={recargarCabecera}
          />
        </>
      )}
    </Detalle>
  );
};
