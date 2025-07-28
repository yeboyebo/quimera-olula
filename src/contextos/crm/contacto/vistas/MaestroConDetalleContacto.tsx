import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Contacto } from "../diseño.ts";
import { getContactos } from "../infraestructura.ts";
import { AltaContacto } from "./AltaContacto.tsx";
import { DetalleContacto } from "./DetalleContacto/DetalleContacto.tsx";
import "./MaestroConDetalleContacto.css";

const metaTablaContacto = [
  { id: "id", cabecera: "Id" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "email", cabecera: "Email" },
];

type Estado = "lista" | "alta";
export const MaestroConDetalleContacto = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const contactos = useLista<Contacto>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      CONTACTO_CREADO: (payload: unknown) => {
        const contacto = payload as Contacto;
        contactos.añadir(contacto);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
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
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton>
            </div>
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
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaContacto emitir={emitir} />
      </QModal>
    </div>
  );
};
