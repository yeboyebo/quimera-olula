import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Factura } from "../diseño.ts";
import { getFacturas } from "../infraestructura.ts";

import { AltaFactura } from "./AltaFactura.tsx";

import { MetaTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { DetalleFactura } from "./DetalleFactura/DetalleFactura.tsx";
import "./MaestroConDetalleFactura.css";

const metaTablaFactura: MetaTabla<Factura> = [
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
    tipo: "moneda",
  },
];

type Estado = "lista" | "alta";
export const MaestroConDetalleFactura = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const facturas = useLista<Factura>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      FACTURA_CREADA: (payload: unknown) => {
        const factura = payload as Factura;
        facturas.añadir(factura);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      FACTURA_CAMBIADA: (payload: unknown) => {
        const factura = payload as Factura;
        facturas.modificar(factura);
      },
      CANCELAR_SELECCION: () => {
        facturas.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);
  const emision = (evento: string, payload?: unknown) => () =>
    emitir(evento, payload);

  return (
    <div className="Factura">
      <maestro-detalle>
        <div className="Maestro">
          <h2>Facturas</h2>
          <Listado
            metaTabla={metaTablaFactura}
            entidades={facturas.lista}
            setEntidades={facturas.setLista}
            seleccionada={facturas.seleccionada}
            setSeleccionada={facturas.seleccionar}
            cargar={getFacturas}
          />
          <div className="maestro-botones">
            <QBoton onClick={emision("ALTA_INICIADA")}>Crear Factura</QBoton>
          </div>
        </div>
        <div className="Detalle">
          <DetalleFactura
            facturaInicial={facturas.seleccionada}
            emitir={emitir}
          />
        </div>

        <QModal
          nombre="modal"
          abierto={estado === "alta"}
          onCerrar={emision("ALTA_CANCELADA")}
        >
          <AltaFactura publicar={emitir} />
        </QModal>
      </maestro-detalle>
    </div>
  );
};
