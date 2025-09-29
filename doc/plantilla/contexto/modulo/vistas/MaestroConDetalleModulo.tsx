import { useCallback } from "react";
import { QBoton } from "../../../../../src/componentes/atomos/qboton.tsx";
import { Listado } from "../../../../../src/componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../../src/componentes/maestro/MaestroDetalleResponsive.tsx";
import { ListaSeleccionable } from "../../../../../src/contextos/comun/diseño.ts";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  seleccionarItem,
} from "../../../../../src/contextos/comun/entidad.ts";
import { pipe } from "../../../../../src/contextos/comun/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "../../../../../src/contextos/comun/useMaquina.ts";
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
      <MaestroDetalleResponsive<Modulo>
        seleccionada={seleccionada}
        Maestro={
          <>
            <h2>Módulos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nuevo</QBoton>
              <QBoton
                deshabilitado={!seleccionada}
                onClick={() => emitir("borrar")}
              >
                Borrar
              </QBoton>
            </div>
            <Listado
              metaTabla={metaTablaModulo}
              entidades={modulos.lista}
              setEntidades={setEntidades}
              seleccionada={seleccionada}
              setSeleccionada={setSeleccionada}
              cargar={getModulos}
            />
          </>
        }
        Detalle={<DetalleModulo moduloInicial={seleccionada} emitir={emitir} />}
      />
      <CrearModulo emitir={emitir} activo={estado === "creando"} />
    </div>
  );
};
