import { QBoton } from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ListaSeleccionable } from "@olula/lib/diseño.js";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  listaSeleccionableVacia,
  quitarItem,
  seleccionarItem,
} from "@olula/lib/entidad.ts";
import { pipe } from "@olula/lib/funcional.js";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "@olula/lib/useMaquina.ts";
import { useContext, useEffect } from "react";
import { LineaFactura as Linea } from "../../../diseño.ts";
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
      edicion_confirmada: "Inactivo",
      edicion_cancelada: "Inactivo",
    },
    ConfirmandoBorrado: {
      borrado_confirmado: "Inactivo",
      borrado_cancelado: "Inactivo",
    },
  },
};

export const Lineas = ({
  facturaId,
  facturaEditable,
  onCabeceraModificada,
}: {
  onCabeceraModificada: () => void;
  facturaId: string;
  facturaEditable?: boolean;
}) => {
  const { intentar } = useContext(ContextoError);

  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });

  const { lineas } = contexto;

  useEffect(() => {
    const cargarLineas = async () => {
      const nuevasLineas = await intentar(() => getLineas(facturaId));
      emitir("lineas_cargadas", nuevasLineas);
    };

    emitir("cargar");
    cargarLineas();
  }, [facturaId, emitir, intentar]);

  const seleccionada = getSeleccionada(lineas);

  const refrescarCabecera = async () => {
    const lineasCargadas = await getLineas(facturaId);
    emitir("lineas_cargadas", lineasCargadas);
    onCabeceraModificada();
  };

  return (
    <>
      {facturaEditable && (
        <div className="botones maestro-botones ">
          <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
          <QBoton
            deshabilitado={!seleccionada}
            onClick={() => emitir("editar")}
          >
            Editar
          </QBoton>
          <QBoton
            deshabilitado={!seleccionada}
            onClick={() => emitir("borrar")}
          >
            Borrar
          </QBoton>
        </div>
      )}
      <LineasLista
        lineas={lineas.lista}
        seleccionada={seleccionada?.id}
        emitir={emitir}
        idFactura={facturaId}
        refrescarCabecera={refrescarCabecera}
      />
      <AltaLinea
        publicar={emitir}
        activo={estado === "Creando"}
        idFactura={facturaId}
        refrescarCabecera={refrescarCabecera}
      />

      {seleccionada && (
        <EdicionLinea
          publicar={emitir}
          activo={estado === "Editando" && seleccionada !== null}
          lineaSeleccionada={seleccionada}
          idFactura={facturaId}
          refrescarCabecera={refrescarCabecera}
        />
      )}
      <BajaLinea
        publicar={emitir}
        activo={estado === "ConfirmandoBorrado"}
        idLinea={seleccionada?.id}
        idFactura={facturaId}
        refrescarCabecera={refrescarCabecera}
      />
    </>
  );
};
