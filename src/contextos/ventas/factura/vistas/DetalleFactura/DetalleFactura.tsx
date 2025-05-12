import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../comun/useMaquina.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
import { Factura } from "../../diseño.ts";

import { getFactura, patchFactura } from "../../infraestructura.ts";
import "./DetalleFactura.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";

import { TabObservaciones } from "./TabObservaciones.tsx";

import { useContext } from "react";
import { ContextoError } from "../../../../comun/contexto.ts";
import { facturaVacia, metaFactura } from "../../dominio.ts";
import { TabDatos } from "./TabDatos.tsx";
type ParamOpcion = {
  valor: string;
  descripcion?: string;
};
export type ValorControl = null | string | ParamOpcion;
type Estado = "defecto";

export const DetalleFactura = ({
  facturaInicial = null,
  emitir = () => {},
}: {
  facturaInicial?: Factura | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();

  const { intentar } = useContext(ContextoError);

  const facturaId = facturaInicial?.id ?? params.id;
  const titulo = (factura: Entidad) => factura.codigo as string;

  const factura = useModelo(metaFactura, facturaVacia);
  const { modelo, init } = factura;

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        await intentar(() => patchFactura(modelo.id, modelo));
        recargarCabecera();
      },
      CLIENTE_FACTURA_CAMBIADO: async () => {
        await recargarCabecera();
      },
    },
  };
  const emitirFactura = useMaquina(maquina, "defecto", () => {});

  const recargarCabecera = async () => {
    const nuevaFactura = await getFactura(modelo.id);
    init(nuevaFactura);
    emitir("FACTURA_CAMBIADA", nuevaFactura);
  };

  return (
    <Detalle
      id={facturaId}
      obtenerTitulo={titulo}
      setEntidad={(f) => init(f)}
      entidad={modelo}
      cargar={getFactura}
    >
      {!!facturaId && (
        <>
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Cliente"
                children={
                  <TabCliente factura={factura} publicar={emitirFactura} />
                }
              />,
              <Tab
                key="tab-2"
                label="Datos"
                children={<TabDatos factura={factura} />}
              />,
              <Tab
                key="tab-3"
                label="Observaciones"
                children={<TabObservaciones factura={factura} />}
              />,
            ]}
          ></Tabs>
          {factura.modificado && (
            <div className="botones maestro-botones ">
              <QBoton
                onClick={() => emitirFactura("GUARDAR_INICIADO")}
                deshabilitado={!factura.valido}
              >
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={() => init()}>
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
          <Lineas factura={factura} onCabeceraModificada={recargarCabecera} />
        </>
      )}
    </Detalle>
  );
};
