import { useState } from "react";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Contacto } from "../diseño.ts";
import { getContactos } from "../infraestructura.ts";
import { DetalleContacto } from "./DetalleContacto/DetalleContacto.tsx";
import "./MaestroConDetalleContacto.css";

const metaTablaContacto = [
  { id: "id", cabecera: "Id" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "email", cabecera: "Email" },
];

type Estado = "lista";
export const MaestroConDetalleContacto = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const contactos = useLista<Contacto>([]);

  const maquina: Maquina<Estado> = {
    lista: {
      CONTACTO_CAMBIADO: (payload: unknown) => {
        const contacto = payload as Contacto;
        contactos.modificar(contacto);
      },
      CANCELAR_SELECCION: () => {
        contactos.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  return (
    <div className="Contacto">
      <MaestroDetalleResponsive<Contacto>
        seleccionada={contactos.seleccionada}
        Maestro={
          <>
            <h2>Contactos</h2>
            <Listado
              metaTabla={metaTablaContacto}
              entidades={contactos.lista}
              setEntidades={contactos.setLista}
              seleccionada={contactos.seleccionada}
              setSeleccionada={contactos.seleccionar}
              cargar={getContactos}
            />
          </>
        }
        Detalle={
          <DetalleContacto
            contactoInicial={contactos.seleccionada}
            emitir={emitir}
          />
        }
      />
    </div>
  );
};
