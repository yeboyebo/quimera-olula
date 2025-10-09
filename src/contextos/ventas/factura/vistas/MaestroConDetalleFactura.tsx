import { QModal } from "@quimera/comp/moleculas/qmodal.tsx";
import { useCallback } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
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
  quitarSeleccion,
  seleccionarItem,
} from "../../../comun/entidad.ts";
import { pipe } from "../../../comun/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "../../../comun/useMaquina.ts";
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
