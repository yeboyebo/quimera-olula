import { useCallback, useEffect, useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { QModal } from "../../../../componentes/moleculas/qmodal.tsx";
import {
  getElemento,
  quitarEntidadDeLista,
  refrescarSeleccionada
} from "../../../comun/dominio.ts";
import { HookModelo } from "../../../comun/useModelo.ts";
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
  cliente: HookModelo<Cliente>;
  onEntidadActualizada: (entidad: Cliente) => void;
}

export const TabCuentasBanco = ({
  cliente,
}: TabCuentasBancoProps) => {

  const { modelo, dispatch } = cliente;

  const [modo, setModo] = useState<"lista" | "alta" | "edicion">("lista");
  const [cuentas, setCuentas] = useState<CuentaBanco[]>([]);
  const [seleccionada, setSeleccionada] = useState<string | undefined>(undefined);
  const [cargando, setCargando] = useState(true);

  const cargarCuentas = useCallback(async () => {
    setCargando(true);
    const cuentas = await getCuentasBanco(modelo.id);
    setCuentas(cuentas);
    if (seleccionada) {
      refrescarSeleccionada(cuentas, seleccionada, setSeleccionada);
    }
    setCargando(false);
  }, [modelo.id, seleccionada]);

  useEffect(() => {
    if (modelo.id) cargarCuentas();
  }, [modelo.id, cargarCuentas]);

  const onDomiciliarCuenta = async () => {
    if (!seleccionada) return;

    await domiciliarCuenta(modelo.id, seleccionada);
    dispatch({
      type: "set_campo",
      payload: { campo: "cuenta_domiciliada", valor: seleccionada }
    });
    // setCampo("cuenta_domiciliada")(seleccionada);
    // setSeleccionada(null);
  };

  const onGuardarNuevaCuenta = async () => {
    setModo("lista");
  };

  const onGuardarEdicionCuenta = async () => {
    setModo("lista");
  };

  const onBorrarCuenta = async () => {
    if (!seleccionada) return;

    await deleteCuentaBanco(modelo.id, seleccionada);
    setCuentas(quitarEntidadDeLista<CuentaBanco>(cuentas, seleccionada));
    setSeleccionada(undefined);
  };

  const desmarcarCuentaDomiciliada = async () => {
    if (!modelo.id) return;

    await desmarcarCuentaDomiciliacion(modelo.id);
  };

  return (
    <>
      <div className="detalle-cliente-tab-contenido">
        <div className="CuentaBancoDomiciliacion maestro-botones">
          <span>Domiciliar: {modelo.cuenta_domiciliada}</span>
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
          seleccionadaId={seleccionada}
          onSeleccion={(cuenta) => setSeleccionada(cuenta.id)}
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
          clienteId={modelo.id}
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
            clienteId={modelo.id}
            cuenta={getElemento(cuentas, seleccionada)}
            onCuentaActualizada={onGuardarEdicionCuenta}
            onCancelar={() => setModo("lista")}
          />
        )}
      </QModal>
    </>
  );
};
