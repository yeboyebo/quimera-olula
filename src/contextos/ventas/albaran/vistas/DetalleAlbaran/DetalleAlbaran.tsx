import { useParams } from "react-router";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../componentes/detalle/tabs/Tabs.tsx";
import { EmitirEvento, Entidad } from "../../../../comun/diseño.ts";
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

import { useContext } from "react";
import { QModalConfirmacion } from "../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { ConfigMaquina4, useMaquina4 } from "../../../../comun/useMaquina.ts";
import { TotalesVenta } from "../../../venta/vistas/TotalesVenta.tsx";

type ParamOpcion = {
  valor: string;
  descripcion?: string;
};
export type ValorControl = null | string | ParamOpcion;
type Estado = "Defecto" | "ConfirmarBorrado";
type Contexto = Record<string, unknown>;

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

  const configMaquina: ConfigMaquina4<Estado, Contexto> = {
    inicial: {
      estado: "Defecto",
      contexto: {},
    },
    estados: {
      Defecto: {
        guardar_iniciado: "Defecto",
        cliente_albaran_cambiado: "Defecto",
        borrar_solicitado: "ConfirmarBorrado",
      },
      ConfirmarBorrado: {
        borrar_confirmado: "Defecto",
        borrar_cancelado: "Defecto",
      },
    },
  };

  const [emitirAlbaran, { estado }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });

  const recargarCabecera = async () => {
    const nuevoAlbaran = await getAlbaran(modelo.id);
    init(nuevoAlbaran);
    emitir("albaran_cambiado", nuevoAlbaran);
  };

  const guardar = async () => {
    await intentar(() => patchAlbaran(modelo.id, modelo));
    await recargarCabecera();
    emitirAlbaran("guardar_iniciado");
  };

  const cancelar = () => {
    init();
    emitir("cancelar_seleccion");
  };

  const onBorrarConfirmado = async () => {
    await borrarAlbaran(modelo.id);
    emitir("albaran_borrado", modelo);
    emitirAlbaran("borrar_confirmado");
  };

  return (
    <Detalle
      id={albaranId}
      obtenerTitulo={titulo}
      setEntidad={(a) => init(a)}
      entidad={modelo}
      cargar={getAlbaran}
      cerrarDetalle={cancelar}
    >
      {!!albaranId && (
        <div className="DetalleAlbaran">
          <div className="botones maestro-botones ">
            <QBoton onClick={() => emitirAlbaran("borrar_solicitado")}>
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
              <QBoton onClick={guardar} deshabilitado={!albaran.valido}>
                Guardar
              </QBoton>
              <QBoton tipo="reset" variante="texto" onClick={cancelar}>
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
            abierto={estado === "ConfirmarBorrado"}
            titulo="Confirmar borrar"
            mensaje="¿Está seguro de que desea borrar este albarán?"
            onCerrar={() => emitirAlbaran("borrar_cancelado")}
            onAceptar={onBorrarConfirmado}
          />
        </div>
      )}
    </Detalle>
  );
};
