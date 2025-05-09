import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../comun/useMaquina.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
import { Albaran } from "../../diseño.ts";
import { albaranVacio, metaAlbaran } from "../../dominio.ts";
import { getAlbaran, patchAlbaran } from "../../infraestructura.ts";
// import "./DetalleAlbaran.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

import { useContext } from "react";
import { ContextoError } from "../../../../comun/contexto.ts";
type ParamOpcion = {
  valor: string;
  descripcion?: string;
};
export type ValorControl = null | string | ParamOpcion;
type Estado = "defecto";

export const DetalleAlbaran = ({
  albaranInicial = null,
  emitir = () => {},
}: {
  albaranInicial?: Albaran | null;
  emitir?: EmitirEvento;
}) => {
  const params = useParams();

  const { intentar } = useContext(ContextoError);

  const albaranId = albaranInicial?.id ?? params.id;
  const titulo = (albaran: Entidad) => albaran.codigo as string;

  const albaran = useModelo(metaAlbaran, albaranVacio);
  const { modelo, init } = albaran;

  const maquina: Maquina<Estado> = {
    defecto: {
      GUARDAR_INICIADO: async () => {
        await intentar(() => patchAlbaran(modelo.id, modelo));
        recargarCabecera();
      },
      CLIENTE_ALBARAN_CAMBIADO: async () => {
        await recargarCabecera();
      },
    },
  };
  const emitirAlbaran = useMaquina(maquina, "defecto", () => {});

  const recargarCabecera = async () => {
    const nuevoAlbaran = await getAlbaran(modelo.id);
    init(nuevoAlbaran);
    emitir("ALBARAN_CAMBIADO", nuevoAlbaran);
  };

  return (
    <Detalle
      id={albaranId}
      obtenerTitulo={titulo}
      setEntidad={(a) => init(a)}
      entidad={modelo}
      cargar={getAlbaran}
    >
      {!!albaranId && (
        <>
          <Tabs
            children={[
              <Tab
                key="tab-1"
                label="Cliente"
                children={
                  <TabCliente albaran={albaran} publicar={emitirAlbaran} />
                }
              />,
              <Tab
                key="tab-2"
                label="Datos"
                children={<TabDatos albaran={albaran} />}
              />,
              <Tab
                key="tab-3"
                label="Observaciones"
                children={<TabObservaciones albaran={albaran} />}
              />,
            ]}
          ></Tabs>
          {albaran.modificado && (
            <div className="botones maestro-botones ">
              <QBoton
                onClick={() => emitirAlbaran("GUARDAR_INICIADO")}
                deshabilitado={!albaran.valido}
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
          <Lineas albaran={albaran} onCabeceraModificada={recargarCabecera} />
        </>
      )}
    </Detalle>
  );
};
