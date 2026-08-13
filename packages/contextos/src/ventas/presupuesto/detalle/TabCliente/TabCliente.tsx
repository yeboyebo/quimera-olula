import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { CambioClienteVenta } from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/CambioClienteVenta.tsx";
import { CambioCliente } from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/diseño.ts";
import { BotonCambiar } from "#/ventas/comun/componentes/BotonCambiar.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { formatearDireccionUnaLinea } from "@olula/lib/dominio.ts";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useState } from "react";
import { Presupuesto } from "../../diseño.ts";
import { EstadoPresupuesto } from "../diseño.ts";
import { CambiarDireccionPresupuesto } from "./CambiarDireccionPresupuesto.tsx";
import "./TabCliente.css";

interface TabClienteProps {
  presupuesto: HookModelo<Presupuesto>;
  estado: EstadoPresupuesto;
  publicar?: (evento: string, payload?: unknown) => void;
}

export const TabCliente = ({
  presupuesto,
  estado,
  publicar = async () => {},
}: TabClienteProps) => {
  const { modelo } = presupuesto;
  const puedeEditarCliente = !modelo.aprobado;
  const mostrarBotonCambiarCliente = estado === "ABIERTO" && puedeEditarCliente;
  const clienteId = modelo.cliente.cliente_id;
  const clienteNoRegistrado = !clienteId || clienteId === "None";
  const [editandoDireccion, setEditandoDireccion] = useState(false);

  const direccionResumen = formatearDireccionUnaLinea(modelo.cliente.direccion).trim();
  const direccionSinDefinir = direccionResumen.replace(/[,\s]/g, "").length === 0;

  const onGuardarCambioCliente = async (cambios: CambioCliente) => {
    publicar("cambio_cliente_listo", cambios);
  };

  return (
    <div className="TabCliente">
      <quimera-formulario>
        <Cliente
          nombre="cliente_id"
          valor={modelo.cliente.cliente_id ?? ""}
          descripcion={modelo.cliente.nombre_cliente}
          deshabilitado={true}
        />
        <QInput
          nombre="id_fiscal"
          label="ID Fiscal"
          valor={modelo.cliente.id_fiscal}
          deshabilitado={true}
        />

        {mostrarBotonCambiarCliente && (
          <div className="TabCliente-accion">
            <BotonCambiar
              titulo="Cambiar cliente y dirección"
              onClick={() => publicar("cambio_cliente_solicitado")}
            />
          </div>
        )}

        {!clienteNoRegistrado ? (
          <DirCliente
            clienteId={modelo.cliente.cliente_id ?? undefined}
            nombre="direccion_id"
            valor={modelo.cliente.direccion_id ?? ""}
            deshabilitado={!puedeEditarCliente}
            onChange={() => {}}
          />
        ) : (
          <section className="TabCliente-direccion-resumen">
            <div className="TabCliente-direccion-resumen-label">Dirección</div>
            <div className="TabCliente-direccion-resumen-contenido">
              <span>
                {direccionSinDefinir ? "Dirección sin definir" : direccionResumen}
              </span>
              {puedeEditarCliente && (
                <QBoton
                  tamaño="pequeño"
                  variante="texto"
                  onClick={() => setEditandoDireccion(true)}
                >
                  Editar
                </QBoton>
              )}
            </div>
          </section>
        )}
      </quimera-formulario>

      {puedeEditarCliente && estado === "CAMBIANDO_CLIENTE" && (
        <CambioClienteVenta
          venta={presupuesto}
          inicializarDesdeVenta={true}
          editarDireccionNoRegistrado={false}
          onGuardar={onGuardarCambioCliente}
          onCancelar={() => publicar("cambio_cliente_cancelado")}
        />
      )}

      {clienteNoRegistrado && editandoDireccion && (
        <CambiarDireccionPresupuesto
          presupuesto={presupuesto}
          publicar={publicar}
          onCerrar={() => setEditandoDireccion(false)}
        />
      )}
    </div>
  );
};
