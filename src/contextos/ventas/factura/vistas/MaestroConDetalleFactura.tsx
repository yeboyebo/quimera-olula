import { useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Factura } from "../diseño.ts";
import { metaTablaFactura } from "../dominio.ts";
import { getFacturas } from "../infraestructura.ts";
import { AltaFactura } from "./CrearFactura.tsx";
import { DetalleFactura } from "./DetalleFactura/DetalleFactura.tsx";
import "./MaestroConDetalleFactura.css";

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
      <MaestroDetalleResponsive<Factura>
        seleccionada={facturas.seleccionada}
        Maestro={
          <>
            <h2>Facturas</h2>
            <div className="maestro-botones">
              <QBoton onClick={emision("ALTA_INICIADA")}>Crear Factura</QBoton>
            </div>
            <Listado
              metaTabla={metaTablaFactura}
              entidades={facturas.lista}
              setEntidades={facturas.setLista}
              seleccionada={facturas.seleccionada}
              setSeleccionada={facturas.seleccionar}
              cargar={getFacturas}
            />
          </>
        }
        Detalle={
          <DetalleFactura
            facturaInicial={facturas.seleccionada}
            emitir={emitir}
          />
        }
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={emision("ALTA_CANCELADA")}
      >
        <AltaFactura publicar={emitir} />
      </QModal>
    </div>
  );
};
