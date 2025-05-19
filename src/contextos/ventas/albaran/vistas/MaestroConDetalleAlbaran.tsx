import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Albaran } from "../diseño.ts";
import { getAlbaranes } from "../infraestructura.ts";

import { AltaAlbaran } from "./AltaAlbaran.tsx";
import { DetalleAlbaran } from "./DetalleAlbaran/DetalleAlbaran.tsx";
import "./MaestroConDetalleAlbaran.css";

const metaTablaAlbaran = [
  {
    id: "codigo",
    cabecera: "Código",
  },
  {
    id: "nombre_cliente",
    cabecera: "Cliente",
  },
  {
    id: "total",
    cabecera: "Total",
  },
];

type Estado = "lista" | "alta";
export const MaestroConDetalleAlbaran = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const albaranes = useLista<Albaran>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      ALBARAN_CREADO: (payload: unknown) => {
        const albaran = payload as Albaran;
        albaranes.añadir(albaran);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      ALBARAN_CAMBIADO: (payload: unknown) => {
        const albaran = payload as Albaran;
        albaranes.modificar(albaran);
      },
      ALBARAN_BORRADO: (payload: unknown) => {
        const albaran = payload as Albaran;
        albaranes.eliminar(albaran);
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);
  const emision = (evento: string, payload?: unknown) => () =>
    emitir(evento, payload);

  return (
    <maestro-detalle name="albaranes">
      <div className="Maestro">
        <h2>Albaranes</h2>
        <Listado
          metaTabla={metaTablaAlbaran}
          entidades={albaranes.lista}
          setEntidades={albaranes.setLista}
          seleccionada={albaranes.seleccionada}
          setSeleccionada={albaranes.seleccionar}
          cargar={getAlbaranes}
        />
        <div className="maestro-botones">
          <QBoton onClick={emision("ALTA_INICIADA")}>Crear Albarán</QBoton>
        </div>
      </div>
      <div className="Detalle">
        <DetalleAlbaran
          albaranInicial={albaranes.seleccionada}
          emitir={emitir}
        />
      </div>

      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={emision("ALTA_CANCELADA")}
      >
        <AltaAlbaran publicar={emitir} />
      </QModal>
    </maestro-detalle>
  );
};
