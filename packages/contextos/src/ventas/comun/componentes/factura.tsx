import { QAutocompletar } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { ClausulaFiltro, Filtro } from "@olula/lib/diseño.ts";
import { useState } from "react";
import { Factura as FacturaVenta } from "../../factura/diseño.ts";
import { getFacturas } from "../../factura/infraestructura.ts";
import { facturaConCliente, facturaDeCliente } from "./factura_texto.ts";

export type OpcionFactura = {
  valor: string;
  /** Texto que se muestra: lo genera renderOpcion. */
  descripcion: string;
  /** Código de la factura, aparte de la descripción, para quien solo quiera guardarlo. */
  codigo: string;
  factura: FacturaVenta;
};

interface FacturaProps {
  /**
   * Sin la prop no se filtra por cliente y la descripción incluye su nombre.
   * Con la prop se filtra por ese cliente; si viene vacía se exige elegir
   * cliente antes de poder buscar.
   */
  clienteId?: string;
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  deshabilitado?: boolean;
  autoFocus?: boolean;
  autoSeleccion?: boolean;
  longitudMinima?: number;
  ref?: React.RefObject<HTMLInputElement | null>;
  renderOpcion?: (factura: FacturaVenta) => string;
  onChange?: (opcion: OpcionFactura | null) => void;
}

const filtroFacturas = (texto: string, clienteId?: string): Filtro =>
  clienteId === undefined
    ? { or: [["nombre_cliente", "~", texto], ["codigo", "~", texto]] }
    : ([
        ["codigo", "~", texto],
        ["codcliente", "~", clienteId],
      ] as ClausulaFiltro[]);

export const Factura = ({
  clienteId,
  descripcion = "",
  valor,
  nombre = "factura_id",
  label = "Factura",
  deshabilitado = false,
  renderOpcion,
  onChange,
  ...props
}: FacturaProps) => {
  const [intentoBusquedaSinCliente, setIntentoBusquedaSinCliente] =
    useState(false);

  const describir =
    renderOpcion ??
    (clienteId === undefined ? facturaConCliente : facturaDeCliente);

  const obtenerOpciones = async (
    texto: string,
    id?: string
  ): Promise<OpcionFactura[]> => {
    const filtro = id
      ? ([["id", "=", id]] as ClausulaFiltro[])
      : filtroFacturas(texto, clienteId);

    if (!id) {
      if (!texto || texto.trim() === "") {
        setIntentoBusquedaSinCliente(false);
        return [];
      }

      if (clienteId !== undefined && clienteId.trim() === "") {
        setIntentoBusquedaSinCliente(true);
        return [];
      }

      setIntentoBusquedaSinCliente(false);
    }

    const { datos } = await getFacturas(filtro, ["fecha", "DESC"], {
      pagina: 1,
      limite: 10,
    });

    if (!Array.isArray(datos)) {
      return [];
    }

    return datos.map((factura) => ({
      valor: factura.id,
      descripcion: describir(factura),
      codigo: factura.codigo,
      factura,
    }));
  };

  return (
    <QAutocompletar
      label={label}
      nombre={nombre}
      onChange={onChange}
      valor={valor}
      obtenerOpciones={obtenerOpciones}
      descripcion={descripcion}
      deshabilitado={deshabilitado}
      erroneo={intentoBusquedaSinCliente}
      textoValidacion={
        intentoBusquedaSinCliente
          ? "El campo cliente debe estar informado"
          : undefined
      }
      {...props}
    />
  );
};
