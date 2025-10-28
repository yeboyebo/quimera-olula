import { MaestroDetalle, QBoton } from "@olula/componentes/index.ts";
import { ListaSeleccionable } from "@olula/lib/diseño.ts";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  seleccionarItem,
} from "@olula/lib/entidad.ts";
import { pipe } from "@olula/lib/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "@olula/lib/useMaquina.ts";
import { useCallback } from "react";
import { Modulo } from "../diseño.ts";
import { getModulos } from "../infraestructura.ts";
import { CrearModulo } from "./CrearModulo";
import { DetalleModulo } from "./DetalleModulo/DetalleModulo";

const metaTablaModulo = [
  { id: "id", cabecera: "ID" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "descripcion", cabecera: "Descripción" },
  { id: "estado", cabecera: "Estado" },
];

type Estado = "inactivo" | "creando" | "borrando";
type Contexto = { modulos: ListaSeleccionable<Modulo> };

const setModulos =
  (
    aplicable: (
      modulos: ListaSeleccionable<Modulo>
    ) => ListaSeleccionable<Modulo>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => ({
    ...maquina,
    contexto: {
      ...maquina.contexto,
      modulos: aplicable(maquina.contexto.modulos),
    },
  });

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {
      modulos: listaSeleccionableVacia<Modulo>(),
    },
  },
  estados: {
    inactivo: {
      crear: "creando",
      modulo_cambiado: ({ maquina, payload }) =>
        pipe(maquina, setModulos(cambiarItem(payload as Modulo))),
      modulo_seleccionado: ({ maquina, payload }) =>
        pipe(maquina, setModulos(seleccionarItem(payload as Modulo))),
      modulo_borrado: ({ maquina }) => {
        const { modulos } = maquina.contexto;
        if (!modulos.idActivo) return maquina;
        return pipe(maquina, setModulos(quitarItem(modulos.idActivo)));
      },
      modulos_cargados: ({ maquina, payload }) =>
        pipe(maquina, setModulos(cargar(payload as Modulo[]))),
      borrar: "borrando",
    },
    creando: {
      modulo_creado: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo"),
          setModulos(incluirItem(payload as Modulo, {}))
        ),
      creacion_cancelada: "inactivo",
    },
    borrando: {
      borrado_cancelado: "inactivo",
      borrado_confirmado: "inactivo",
    },
  },
};

export const MaestroConDetalleModulo = () => {
  const [emitir, { estado, contexto }] = useMaquina4({ config: configMaquina });
  const { modulos } = contexto;

  const setEntidades = useCallback(
    (payload: Modulo[]) => emitir("modulos_cargados", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Modulo) => emitir("modulo_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(modulos);

  return (
    <div className="Modulo">
      <MaestroDetalle<Modulo>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Modulos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
            </div>
          </>
        }
        metaTabla={metaTablaModulo}
        // tarjeta={(modulo) => <TarjetaModulo modulo={modulo} />}
        entidades={modulo.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getModulos}
        Detalle={
          <DetalleModulo
            key={seleccionada?.id}
            moduloInicial={seleccionada}
            publicar={emitir}
          />
        }
      />
      <CrearModulo emitir={emitir} activo={estado === "creando"} />
    </div>
  );
};
