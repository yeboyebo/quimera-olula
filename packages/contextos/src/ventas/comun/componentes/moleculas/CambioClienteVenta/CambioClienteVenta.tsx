import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput, QModal } from "@olula/componentes/index.js";
import { Modelo } from "@olula/lib/diseño.js";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect } from "react";
import "./CambioClienteVenta.css";
import { cambioClienteVacio, metaCambioCliente } from "./dominio.ts";

export interface VentaConCliente extends Modelo {
  id: string;
  cliente_id: string;
  nombre_cliente: string;
  direccion_id: string;
  id_fiscal?: string;
  tipo_via?: string;
  nombre_via?: string;
  ciudad?: string;
}

export interface CambioClienteProps<T extends VentaConCliente> {
  venta: HookModelo<T>;
  activo?: boolean;
  onGuardar: (cambios: Partial<T>) => Promise<void>;
  onCancelar?: () => void;
  titulo?: string;
  permitirClienteNoRegistrado?: boolean;
}

export const CambioClienteVenta = <T extends VentaConCliente>({
  venta,
  activo = true,
  onGuardar,
  onCancelar,
  titulo = "Cambiar cliente",
}: CambioClienteProps<T>) => {
  const { modelo, uiProps, valido, init } = useModelo(
    metaCambioCliente,
    cambioClienteVacio()
  );

  const inicializarFormulario = useCallback(() => {
    if (!activo) return;

    init({
      cliente_id: venta.modelo.cliente_id,
      nombre_cliente: venta.modelo.nombre_cliente,
      direccion_id: venta.modelo.direccion_id,
    });
  }, [activo, venta.modelo, init]);

  useEffect(() => {
    if (activo) {
      inicializarFormulario();
    }
  }, [activo, inicializarFormulario]);

  const esClienteRegistrado = venta.modelo.cliente_id !== "None";
  // const esClienteNoRegistrado =
  //   permitirClienteNoRegistrado && !esClienteRegistrado;

  const prepararCambios = (): Partial<T> => {
    if (esClienteRegistrado) {
      return {
        cliente_id: modelo.cliente_id,
        direccion_id: modelo.direccion_id,
      } as Partial<T>;
    }

    return {
      nombre_cliente: venta.modelo.nombre_cliente,
      id_fiscal: venta.modelo.id_fiscal,
      tipo_via: venta.modelo.tipo_via,
      nombre_via: venta.modelo.nombre_via,
      ciudad: venta.modelo.ciudad,
    } as Partial<T>;
  };

  const guardar = async () => {
    const cambios = prepararCambios();
    onGuardar(cambios);
    init(cambioClienteVacio());
  };

  const cancelar = () => {
    if (onCancelar) {
      onCancelar();
    }
    init(cambioClienteVacio());
  };

  const renderFormularioClienteRegistrado = () => (
    <>
      <Cliente
        {...uiProps("cliente_id", "nombre_cliente")}
        nombre="cliente_id_cambio"
      />
      <DirCliente
        clienteId={modelo.cliente_id || venta.modelo.cliente_id}
        {...uiProps("direccion_id")}
      />
    </>
  );

  const renderFormularioClienteNoRegistrado = () => (
    <>
      <QInput label="Nombre del Cliente" {...venta.uiProps("nombre_cliente")} />
      <QInput label="ID Fiscal" {...venta.uiProps("id_fiscal")} />
      <QInput label="Tipo de Vía" {...venta.uiProps("tipo_via")} />
      <QInput label="Nombre de la Vía" {...venta.uiProps("nombre_via")} />
      <QInput label="Ciudad" {...venta.uiProps("ciudad")} />
    </>
  );

  return (
    <QModal abierto={activo} nombre="mostrar" onCerrar={cancelar}>
      <div className="CambioCliente">
        <h2>{titulo}</h2>

        <quimera-formulario>
          {esClienteRegistrado
            ? renderFormularioClienteRegistrado()
            : renderFormularioClienteNoRegistrado()}
        </quimera-formulario>

        <div className="botones maestro-botones">
          <QBoton onClick={guardar} deshabilitado={!valido}>
            Guardar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
