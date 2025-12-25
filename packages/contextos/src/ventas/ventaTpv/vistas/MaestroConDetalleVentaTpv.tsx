import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.js";
import { ListaSeleccionable } from "@olula/lib/diseño.js";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  quitarSeleccion,
  seleccionarItem,
} from "@olula/lib/entidad.js";
import { pipe } from "@olula/lib/funcional.js";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "@olula/lib/useMaquina.ts";
import { useCallback } from "react";
import { VentaTpv } from "../diseño.ts";
import { metaTablaFactura } from "../dominio.ts";
import { agenteActivo, getVenta, getVentas, puntoVentaLocal } from "../infraestructura.ts";
// import { AltaFactura } from "./AltaFactura.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { postVenta } from "../infraestructura.ts";
import { DetalleVentaTpv } from "./DetalleVentaTpv/DetalleVentaTpv.tsx";
import "./MaestroConDetalleVentaTpv.css";

type Estado = "Inactivo";
type Contexto = {
  facturas: ListaSeleccionable<VentaTpv>;
};
puntoVentaLocal.actualizar('000001');
agenteActivo.actualizar('000001');
let miPuntoVentaLocal = puntoVentaLocal.obtener() ;
let miAgenteActivo = agenteActivo.obtener() ;

const setFacturas =
  (
    aplicable: (
      facturas: ListaSeleccionable<VentaTpv>
    ) => ListaSeleccionable<VentaTpv>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        facturas: aplicable(maquina.contexto.facturas),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      facturas: listaSeleccionableVacia<VentaTpv>(),
    },
  },
  estados: {
    Inactivo: {
      // crear: "Creando",
      venta_cambiada: ({ maquina, payload }) =>
        pipe(maquina, setFacturas(cambiarItem(payload as VentaTpv))),
      factura_seleccionada: ({ maquina, payload }) =>
        pipe(maquina, setFacturas(seleccionarItem(payload as VentaTpv))),
      cancelar_seleccion: ({ maquina }) =>
        pipe(maquina, setFacturas(quitarSeleccion())),
      factura_borrada: ({ maquina }) => {
        const { facturas } = maquina.contexto;
        if (!facturas.idActivo) {
          return maquina;
        }
        return pipe(maquina, setFacturas(quitarItem(facturas.idActivo)));
      },
      facturas_cargadas: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setFacturas(cargar(payload as VentaTpv[]))
        ),

      factura_creada: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setFacturas(incluirItem(payload as VentaTpv, {}))
        ),
    },
    // Creando: {
    //   factura_creada: ({ maquina, payload, setEstado }) =>
    //     pipe(
    //       maquina,
    //       setEstado("Inactivo" as Estado),
    //       setFacturas(incluirItem(payload as Factura, {}))
    //     ),
    //   alta_cancelada: "Inactivo",
    // },
  },
};



export const MaestroConDetalleVentaTpv = () => {
  const { intentar } = useContext(ContextoError);
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { facturas } = contexto;

  const setEntidades = useCallback(
    (payload: VentaTpv[]) => emitir("facturas_cargadas", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: VentaTpv) => emitir("factura_seleccionada", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(facturas);

  const nueva_venta_clicked = async () => {
    const id = await intentar(() => postVenta()); 
    const facturaCreada = await getVenta(id);
    emitir("factura_creada", facturaCreada);
  };

  return (
    <div className="Factura">
      <MaestroDetalle<VentaTpv>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Ventas TPV</h2>
            <h2>Punto de venta {miPuntoVentaLocal} </h2>
            <h2>Agente {miAgenteActivo} </h2>
            <div className="maestro-botones">
              <QBoton onClick={nueva_venta_clicked}>Nueva Venta</QBoton>
            </div>
          </>
        }
        modoVisualizacion="tabla"
        modoDisposicion="maestro-50"
        metaTabla={metaTablaFactura}
        entidades={facturas.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getVentas}
        Detalle={
          <DetalleVentaTpv ventaInicial={seleccionada} emitir={emitir} />
        }
      />
      {/* <QModal
        nombre="modal"
        abierto={estado === "Creando"}
        onCerrar={() => emitir("alta_cancelada")}
      >
        <AltaFactura publicar={emitir} />
      </QModal> */}
    </div>
  );
};
