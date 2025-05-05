import { useState } from "react";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { actualizarEntidadEnLista, getElemento } from "../../../comun/dominio.ts";
import { DirCliente } from "../diseño.ts";
import { AltaDireccion } from "./AltaDireccion.tsx";
import { EdicionDireccion } from "./EdicionDireccion.tsx";
import { TabDireccionesLista } from "./TabDireccionesLista.tsx";

export const TabDirecciones = ({ clienteId }: { clienteId: string }) => {

  const [modo, setModo] = useState("lista");
  const [direcciones, setDirecciones] = useState<DirCliente[]>([]);
  const [seleccionada, setSeleccionada] = useState<string | undefined>(undefined);

  const actualizarDireccion = (direccion: DirCliente) => {
    setDirecciones(
      actualizarEntidadEnLista<DirCliente>(direcciones, direccion)
    );
    setSeleccionada(direccion.id);
    setModo("lista");
  };

  const añadirDireccion = (direccion: DirCliente) => {
    setDirecciones([direccion, ...direcciones]);
    setSeleccionada(direccion.id);
    setModo("lista");
  };

  return (
    <>
      <TabDireccionesLista
        clienteId={clienteId}
        onEditarDireccion={() => setModo("edicion")}
        onCrearDireccion={() => setModo("alta")}
        direcciones={direcciones}
        setDirecciones={setDirecciones}
        seleccionada={seleccionada}
        setSeleccionada={setSeleccionada}
      />
      <QModal
        nombre="edicionDireccion"
        abierto={modo === "edicion"}
        onCerrar={() => setModo("lista")}
      >
        {seleccionada && (
          <EdicionDireccion
            clienteId={clienteId}
            direccion={getElemento(direcciones, seleccionada)}
            onDireccionActualizada={actualizarDireccion}
            onCancelar={() => setModo("lista")}
          />
        )}
      </QModal>
      <QModal nombre="altaDireccion" abierto={modo === "alta"} onCerrar={() => setModo("lista")} >
        <AltaDireccion
          clienteId={clienteId}
          onDireccionCreada={añadirDireccion}
          onCancelar={() => setModo("lista")}
        />
      </QModal>
    </>
  );
};
