import { QBoton } from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ListaSeleccionable } from "@olula/lib/diseño.js";
import {
  cambiarItem,
  cargar,
  listaSeleccionableVacia,
  quitarItem,
  seleccionarItem,
} from "@olula/lib/entidad.ts";
import { pipe } from "@olula/lib/funcional.js";
import { useLista } from "@olula/lib/useLista.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "@olula/lib/useMaquina.ts";
import { HookModelo } from "@olula/lib/useModelo.js";
import { useContext, useEffect } from "react";
import { LineaPedido as Linea, Pedido } from "../../../diseño.ts";
import { getLineas } from "../../../infraestructura.ts";
import { AltaLinea } from "./AltaLinea.tsx";
import { BajaLinea } from "./BajaLinea.tsx";
import { EdicionLinea } from "./EdicionLinea.tsx";
import { LineasLista } from "./LineasLista.tsx";

type Estado = "Inactivo" | "Creando" | "Editando" | "ConfirmandoBorrado";
type Contexto = {
  lineas: ListaSeleccionable<Linea>;
};

const setLineas =
  (
    aplicable: (lineas: ListaSeleccionable<Linea>) => ListaSeleccionable<Linea>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => ({
    ...maquina,
    contexto: {
      ...maquina.contexto,
      lineas: aplicable(maquina.contexto.lineas),
    },
  });

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      lineas: listaSeleccionableVacia<Linea>(),
    },
  },
  estados: {
    Inactivo: {
      crear: "Creando",
      linea_seleccionada: ({ maquina, payload }) =>
        pipe(maquina, setLineas(seleccionarItem(payload as Linea))),
      linea_cambiada: ({ maquina, payload }) =>
        pipe(maquina, setLineas(cambiarItem(payload as Linea))),
      linea_borrada: ({ maquina }) => {
        const { lineas } = maquina.contexto;
        if (!lineas.idActivo) {
          return maquina;
        }
        return pipe(maquina, setLineas(quitarItem(lineas.idActivo)));
      },
      lineas_cargadas: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setLineas(cargar(payload as Linea[]))
        ),
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setLineas((lineas) => ({
            ...lineas,
            idActivo: null,
          }))
        ),
      editar: "Editando",
      borrar: "ConfirmandoBorrado",
    },
    Creando: {
      linea_creada: "Inactivo",
      creacion_cancelada: "Inactivo",
    },
    Editando: {
      linea_editada: "Inactivo",
      edicion_cancelada: "Inactivo",
    },
    ConfirmandoBorrado: {
      borrado_confirmado: "Inactivo",
      borrado_cancelado: "Inactivo",
    },
  },
};

export const Lineas = ({
  onCabeceraModificada,
  pedido,
}: {
  onCabeceraModificada: () => void;
  pedido: HookModelo<Pedido>;
}) => {
  const pedidoId = pedido?.modelo?.id;
  const { intentar } = useContext(ContextoError);

  const lineas = useLista<Linea>([]);

  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });

  useEffect(() => {
    const cargarLineas = async () => {
      const nuevasLineas = await intentar(() => getLineas(pedidoId));
      emitir("lineas_cargadas", nuevasLineas);
    };

    emitir("cargar");
    cargarLineas();
  }, [pedidoId, emitir, intentar]);

  // const crearLinea = async (payload: NuevaLineaPedido) => {
  //   const idLinea = await intentar(() => postLinea(pedidoId, payload));
  //   await cargarLineas();
  //   emitir("linea_creada", idLinea);
  // };

  // const editarLinea = async (payload: LineaPedido) => {
  //   await intentar(() => patchLinea(pedidoId, payload));
  //   await cargarLineas();
  //   emitir("linea_editada", payload);
  // };

  // const cambiarCantidadLinea = async (linea: LineaPedido, cantidad: number) => {
  //   await intentar(() => patchCantidadLinea(pedidoId, linea, cantidad));
  //   await cargarLineas();
  //   emitir("linea_cambiada", contexto.lineas.lista);
  // };

  // const borrarLinea = async () => {
  //   const lineaId = lineas.seleccionada?.id;
  //   if (!lineaId) return;
  //   await intentar(() => deleteLinea(pedidoId, lineaId));
  //   await cargarLineas();
  //   emitir("linea_borrada");
  // };

  return (
    <>
      {pedido.editable && (
        <div className="botones maestro-botones ">
          <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
          <QBoton
            deshabilitado={!lineas.seleccionada}
            onClick={() => emitir("editar")}
          >
            Editar
          </QBoton>
          <QBoton
            deshabilitado={!lineas.seleccionada}
            onClick={() => emitir("borrar")}
          >
            Borrar
          </QBoton>
        </div>
      )}
      <LineasLista
        lineas={contexto.lineas.lista}
        seleccionada={lineas.seleccionada?.id}
        emitir={emitir}
      />

      <AltaLinea
        publicar={emitir}
        activo={estado === "Creando"}
        idPedido={pedidoId}
      />

      <EdicionLinea
        publicar={emitir}
        activo={estado === "Editando" && lineas.seleccionada}
        lineaSeleccionada={lineas.seleccionada}
        idPedido={pedidoId}
      />

      <BajaLinea
        publicar={emitir}
        activo={estado === "ConfirmandoBorrado"}
        idLinea={lineas.seleccionada?.id}
        idPedido={pedidoId}
      />
      {/* <QModalConfirmacion
        nombre="confirmarBorrarLinea"
        abierto={estado === "ConfirmandoBorrado"}
        titulo="Confirmar borrado"
        mensaje="¿Está seguronCabeceraModificadao de que desea borrar esta línea?"
        onCerrar={() => emitir("borrado_cancelado")}
        onAceptar={borrarLinea}
      /> */}
    </>
  );
};
