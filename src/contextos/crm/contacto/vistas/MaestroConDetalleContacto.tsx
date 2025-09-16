import { useCallback } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { ListaSeleccionable } from "../../../comun/diseño.ts";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  seleccionarItem,
} from "../../../comun/entidad.ts";
import { pipe } from "../../../comun/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "../../../comun/useMaquina.ts";
import { Contacto } from "../diseño.ts";
import { getContactos } from "../infraestructura.ts";
import { AltaContacto } from "./AltaContacto.tsx";
import { DetalleContacto } from "./DetalleContacto/DetalleContacto.tsx";
import "./MaestroConDetalleContacto.css";

const metaTablaContacto: MetaTabla<Contacto> = [
  { id: "id", cabecera: "Id" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "email", cabecera: "Email" },
];

type Estado = "Inactivo" | "Creando";

type Contexto = {
  contactos: ListaSeleccionable<Contacto>;
};

const setContactos =
  (
    aplicable: (
      contactos: ListaSeleccionable<Contacto>
    ) => ListaSeleccionable<Contacto>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        contactos: aplicable(maquina.contexto.contactos),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      contactos: listaSeleccionableVacia<Contacto>(),
    },
  },
  estados: {
    Inactivo: {
      crear: "Creando",
      contacto_cambiado: ({ maquina, payload }) =>
        pipe(maquina, setContactos(cambiarItem(payload as Contacto))),
      contacto_seleccionado: ({ maquina, payload }) =>
        pipe(maquina, setContactos(seleccionarItem(payload as Contacto))),
      contacto_borrado: ({ maquina }) => {
        const { contactos } = maquina.contexto;
        if (!contactos.idActivo) {
          return maquina;
        }
        return pipe(maquina, setContactos(quitarItem(contactos.idActivo)));
      },
      contactos_cargados: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setContactos(cargar(payload as Contacto[]))
        ),
    },
    Creando: {
      contacto_creado: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setContactos(incluirItem(payload as Contacto, {}))
        ),
      creacion_cancelada: "Inactivo",
    },
  },
};

export const MaestroConDetalleContacto = () => {
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { contactos } = contexto;

  const setEntidades = useCallback(
    (payload: Contacto[]) => emitir("contactos_cargados", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Contacto) => emitir("contacto_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(contactos);

  return (
    <div className="Contacto">
      <MaestroDetalleResponsive<Contacto>
        seleccionada={seleccionada}
        Maestro={
          <>
            <h2>Contactos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nuevo</QBoton>
            </div>
            <Listado
              metaTabla={metaTablaContacto}
              entidades={contactos.lista}
              setEntidades={setEntidades}
              seleccionada={seleccionada}
              setSeleccionada={setSeleccionada}
              cargar={getContactos}
            />
          </>
        }
        Detalle={
          <DetalleContacto contactoInicial={seleccionada} publicar={emitir} />
        }
      />
      <AltaContacto publicar={emitir} activo={estado === "Creando"} />
    </div>
  );
};
