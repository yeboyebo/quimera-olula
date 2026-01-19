import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { CrmContacto } from "../diseño.ts";

const metaTablaCrmContactos = [
  { id: "id", cabecera: "ID" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "email", cabecera: "Email" },
];

export const TabCrmContactosLista = ({
  contactos,
  seleccionado,
  emitir,
  cargando,
}: {
  contactos: CrmContacto[];
  seleccionado: CrmContacto | null;
  emitir: (evento: string, payload?: unknown) => void;
  cargando: boolean;
}) => {
  return (
    <div className="CrmContactos">
      <QTabla
        metaTabla={metaTablaCrmContactos}
        datos={contactos}
        cargando={cargando}
        seleccionadaId={seleccionado?.id}
        onSeleccion={(contacto) => emitir("contacto_seleccionado", contacto)}
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
    </div>
  );
};
