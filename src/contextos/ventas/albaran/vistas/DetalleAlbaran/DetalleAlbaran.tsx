import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
import { Maquina, useMaquina } from "../../../../comun/useMaquina.ts";
import { useModelo } from "../../../../comun/useModelo.ts";
import { Albaran } from "../../diseño.ts";
import { albaranVacio, metaAlbaran } from "../../dominio.ts";
import {
  borrarAlbaran,
  getAlbaran,
  patchAlbaran,
} from "../../infraestructura.ts";
import "./DetalleAlbaran.css";
import { Lineas } from "./Lineas/Lineas.tsx";
import { TabCliente } from "./TabCliente/TabCliente.tsx";
import { TabDatos } from "./TabDatos.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

import { useContext, useState } from "react";
import { QModalConfirmacion } from "../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { TotalesVenta } from "../../../venta/vistas/TotalesVenta.tsx";

type ParamOpcion = {
  valor: string;
  descripcion?: string;
};
export type ValorControl = null | string | ParamOpcion;
type Estado = "defecto" | "confirmarBorrado";

export const DetalleAlbaran = ({
  albaranInicial = null,
  emitir = () => {},
}: {
  albaranInicial?: Albaran | null;
  emitir?: EmitirEvento;
}) => {
  const [estado, setEstado] = useState<Estado>("defecto");
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
    confirmarBorrado: {},
  };
  const emitirAlbaran = useMaquina(maquina, "defecto", () => {});

  const recargarCabecera = async () => {
    const nuevoAlbaran = await getAlbaran(modelo.id);
    init(nuevoAlbaran);
    emitir("ALBARAN_CAMBIADO", nuevoAlbaran);
  };

  const onBorrarConfirmado = async () => {
    await borrarAlbaran(modelo.id);
    emitir("ALBARAN_BORRADO", modelo);
    setEstado("defecto");
  };

  return (
    <Detalle
      id={albaranId}
      obtenerTitulo={titulo}
      setEntidad={(a) => init(a)}
      entidad={modelo}
      cargar={getAlbaran}
      cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
    >
      {!!albaranId && (
        <div className="DetalleAlbaran">
          <div className="botones maestro-botones ">
            <QBoton onClick={() => setEstado("confirmarBorrado")}>
              Borrar
            </QBoton>
          </div>
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

          <TotalesVenta
            neto={Number(modelo.neto ?? 0)}
            totalIva={Number(modelo.total_iva ?? 0)}
            total={Number(modelo.total ?? 0)}
            divisa={String(modelo.coddivisa ?? "EUR")}
          />
          <Lineas albaran={albaran} onCabeceraModificada={recargarCabecera} />
          <QModalConfirmacion
            nombre="borrarAlbaran"
            abierto={estado === "confirmarBorrado"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar este albarán?"
            onCerrar={() => setEstado("defecto")}
            onAceptar={onBorrarConfirmado}
          />
        </div>
      )}
    </Detalle>
  );
};
