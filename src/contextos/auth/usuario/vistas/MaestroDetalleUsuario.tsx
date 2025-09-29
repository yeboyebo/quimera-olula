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
import { Usuario } from "../diseño.ts";
import { getUsuarios } from "../infraestructura.ts";
import { CrearUsuario } from "./CrearUsuario";
import { DetalleUsuario } from "./DetalleUsuario/DetalleUsuario";

const metaTablaUsuario = [
  { id: "id", cabecera: "ID" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "descripcion", cabecera: "Descripción" },
  { id: "estado", cabecera: "Estado" },
];

type Estado = "inactivo" | "creando" | "borrando";
type Contexto = { usuarios: ListaSeleccionable<Usuario> };

const setUsuarios =
  (
    aplicable: (
      usuarios: ListaSeleccionable<Usuario>
    ) => ListaSeleccionable<Usuario>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => ({
    ...maquina,
    contexto: {
      ...maquina.contexto,
      usuarios: aplicable(maquina.contexto.usuarios),
    },
  });

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {
      usuarios: listaSeleccionableVacia<Usuario>(),
    },
  },
  estados: {
    inactivo: {
      crear: "creando",
      usuario_cambiado: ({ maquina, payload }) =>
        pipe(maquina, setUsuarios(cambiarItem(payload as Usuario))),
      usuario_seleccionado: ({ maquina, payload }) =>
        pipe(maquina, setUsuarios(seleccionarItem(payload as Usuario))),
      usuario_borrado: ({ maquina }) => {
        const { usuarios } = maquina.contexto;
        if (!usuarios.idActivo) return maquina;
        return pipe(maquina, setUsuarios(quitarItem(usuarios.idActivo)));
      },
      usuarios_cargados: ({ maquina, payload }) =>
        pipe(maquina, setUsuarios(cargar(payload as Usuario[]))),
      borrar: "borrando",
    },
    creando: {
      usuario_creado: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo"),
          setUsuarios(incluirItem(payload as Usuario, {}))
        ),
      creacion_cancelada: "inactivo",
    },
    borrando: {
      borrado_cancelado: "inactivo",
      borrado_confirmado: "inactivo",
    },
  },
};

export const MaestroConDetalleUsuario = () => {
  const [emitir, { estado, contexto }] = useMaquina4({ config: configMaquina });
  const { usuarios } = contexto;

  const setEntidades = useCallback(
    (payload: Usuario[]) => emitir("usuarios_cargados", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Usuario) => emitir("usuario_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(usuarios);

  return (
    <div className="Usuario">
      <MaestroDetalleResponsive<Usuario>
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
              metaTabla={metaTablaUsuario}
              entidades={usuarios.lista}
              setEntidades={setEntidades}
              seleccionada={seleccionada}
              setSeleccionada={setSeleccionada}
              cargar={getUsuarios}
            />
          </>
        }
        Detalle={
          <DetalleUsuario usuarioInicial={seleccionada} emitir={emitir} />
        }
      />
      <CrearUsuario emitir={emitir} activo={estado === "creando"} />
    </div>
  );
};
