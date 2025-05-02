import { useCallback, useEffect, useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import {
    Accion,
    EstadoModelo,
    quitarEntidadDeLista,
    refrescarSeleccionada,
} from "../../../comun/dominio.ts";
import { Cliente, CuentaBanco } from "../diseño.ts";
import {
    deleteCuentaBanco,
    desmarcarCuentaDomiciliacion,
    domiciliarCuenta,
    getCuentasBanco,
} from "../infraestructura.ts";
import { AltaCuentaBanco } from "./AltaCuentaBanco.tsx";
import { EdicionCuentaBanco } from "./EdicionCuentaBanco.tsx";

const metaTablaCuentasBanco = [
  { id: "descripcion", cabecera: "Descripcion" },
  { id: "iban", cabecera: "IBAN" },
  { id: "bic", cabecera: "BIC" },
];

interface TabCuentasBancoProps {
  cliente: EstadoModelo<Cliente>;
  dispatch: (action: Accion<Cliente>) => void;
  setCampo: (campo: string) => (valor: unknown) => void;
  onEntidadActualizada: (entidad: Cliente) => void;
}

export const TabCuentasBanco = ({
  cliente,
  setCampo,
}: TabCuentasBancoProps) => {
  const [modo, setModo] = useState<"lista" | "alta" | "edicion">("lista");
  const [cuentas, setCuentas] = useState<CuentaBanco[]>([]);
  const [seleccionada, setSeleccionada] = useState<CuentaBanco | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarCuentas = useCallback(async () => {
    setCargando(true);
    const cuentas = await getCuentasBanco(cliente.valor.id);
    setCuentas(cuentas);
    refrescarSeleccionada(cuentas, seleccionada?.id, (e) =>
      setSeleccionada(e as CuentaBanco | null)
    );
    setCargando(false);
  }, [cliente.valor.id, seleccionada?.id]);

  useEffect(() => {
    if (cliente.valor.id) cargarCuentas();
  }, [cliente.valor.id, cargarCuentas]);

  const onDomiciliarCuenta = async () => {
    if (!seleccionada) return;

    await domiciliarCuenta(cliente.valor.id, seleccionada.id);
    setCampo("cuenta_domiciliada")(seleccionada.id);
    setSeleccionada(null);
  };

  const onGuardarNuevaCuenta = async () => {
    // if (!modeloEsValido(estado)) return;

    // await postCuentaBanco(cliente.valor.id, estado.valor);
    setModo("lista");
  };

  const onGuardarEdicionCuenta = async () => {
    // if (!modeloEsValido(estado)) return;

    // await patchCuentaBanco(cliente.valor.id, estado.valor);
    setModo("lista");
  };

  const onBorrarCuenta = async () => {
    if (!seleccionada) return;

    await deleteCuentaBanco(cliente.valor.id, seleccionada.id);
    setCuentas(quitarEntidadDeLista<CuentaBanco>(cuentas, seleccionada));
    setSeleccionada(null);
  };

  const desmarcarCuentaDomiciliada = async () => {
    if (!cliente.valor.id) return;

    await desmarcarCuentaDomiciliacion(cliente.valor.id);
  };

  return (
    <>
      <div className="detalle-cliente-tab-contenido">
        <div className="CuentaBancoDomiciliacion maestro-botones">
          <span>Domiciliar: {cliente.valor.cuenta_domiciliada}</span>
          <QBoton onClick={() => desmarcarCuentaDomiciliada()}>
            Desmarcar
          </QBoton>
        </div>
      </div>
      <div className="CuentasBanco">
        <div className="CuentasBancoAcciones">
          <div className="CuentasBancoBotonesIzquierda maestro-botones">
            <QBoton onClick={() => setModo("alta")}>Nueva</QBoton>
            <QBoton
              onClick={() => seleccionada && setModo("edicion")}
              deshabilitado={!seleccionada}
            >
              Editar
            </QBoton>
            <QBoton onClick={onBorrarCuenta} deshabilitado={!seleccionada}>
              Borrar
            </QBoton>
          </div>
          <div className="CuentasBancoBotonDerecha maestro-botones">
            <QBoton onClick={onDomiciliarCuenta}>
              Cuenta de domiciliación
            </QBoton>
          </div>
        </div>
        <QTabla
          metaTabla={metaTablaCuentasBanco}
          datos={cuentas}
          cargando={cargando}
          seleccionadaId={seleccionada?.id}
          onSeleccion={setSeleccionada}
          orden={{ id: "ASC" }}
          onOrdenar={(_: string) => null}
        />
      </div>

      <QModal
        nombre="altaCuentaBanco"
        abierto={modo === "alta"}
        onCerrar={() => setModo("lista")}
      >
        <AltaCuentaBanco
          clienteId={cliente.valor.id}
          onCuentaCreada={onGuardarNuevaCuenta}
          onCancelar={() => setModo("lista")}
        />
      </QModal>

      <QModal
        nombre="edicionCuentaBanco"
        abierto={modo === "edicion"}
        onCerrar={() => setModo("lista")}
      >
        {seleccionada && (
          <EdicionCuentaBanco
            clienteId={cliente.valor.id}
            cuenta={seleccionada}
            onCuentaActualizada={onGuardarEdicionCuenta}
            onCancelar={() => setModo("lista")}
          />
        )}
      </QModal>
    </>
  );
};
