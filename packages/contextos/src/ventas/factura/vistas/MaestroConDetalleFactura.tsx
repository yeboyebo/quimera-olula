import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Listado } from "@olula/componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "@olula/componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
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
import { Factura } from "../diseño.ts";
import { metaTablaFactura } from "../dominio.ts";
import { getFacturas } from "../infraestructura.ts";
import { AltaFactura } from "./CrearFactura.tsx";
import { DetalleFactura } from "./DetalleFactura/DetalleFactura.tsx";
import "./MaestroConDetalleFactura.css";

type Estado = "Inactivo" | "Creando";
type Contexto = {
  facturas: ListaSeleccionable<Factura>;
};

const setFacturas =
  (
    aplicable: (
      facturas: ListaSeleccionable<Factura>
    ) => ListaSeleccionable<Factura>
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
      facturas: listaSeleccionableVacia<Factura>(),
    },
  },
  estados: {
    Inactivo: {
      crear: "Creando",
      factura_cambiada: ({ maquina, payload }) =>
        pipe(maquina, setFacturas(cambiarItem(payload as Factura))),
      factura_seleccionada: ({ maquina, payload }) =>
        pipe(maquina, setFacturas(seleccionarItem(payload as Factura))),
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
          setFacturas(cargar(payload as Factura[]))
        ),
    },
    Creando: {
      factura_creada: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setFacturas(incluirItem(payload as Factura, {}))
        ),
      alta_cancelada: "Inactivo",
    },
  },
};

export const MaestroConDetalleFactura = () => {
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { facturas } = contexto;

  const setEntidades = useCallback(
    (payload: Factura[]) => emitir("facturas_cargadas", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Factura) => emitir("factura_seleccionada", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(facturas);

  return (
    <div className="Factura">
      <MaestroDetalleResponsive<Factura>
        seleccionada={seleccionada}
        Maestro={
          <>
            <h2>Facturas</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Crear Factura</QBoton>
            </div>
            <Listado
              metaTabla={metaTablaFactura}
              entidades={facturas.lista}
              setEntidades={setEntidades}
              seleccionada={seleccionada}
              setSeleccionada={setSeleccionada}
              cargar={getFacturas}
            />
          </>
        }
        Detalle={
          <DetalleFactura facturaInicial={seleccionada} emitir={emitir} />
        }
      />
      <QModal
        nombre="modal"
        abierto={estado === "Creando"}
        onCerrar={() => emitir("alta_cancelada")}
      >
        <AltaFactura publicar={emitir} />
      </QModal>
    </div>
  );
};
