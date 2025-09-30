import { useCallback, useContext, useEffect, useState } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QTabla } from "../../../../../../componentes/atomos/qtabla.tsx";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { ContextoError } from "../../../../../comun/contexto.ts";
import { EmitirEvento } from "../../../../../comun/diseño.ts";
import { useLista } from "../../../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../comun/useMaquina.ts";
import { HookModelo } from "../../../../../comun/useModelo.ts";
import { Cliente, CuentaBanco } from "../../../diseño.ts";
import {
  deleteCuentaBanco,
  desmarcarCuentaDomiciliacion,
  domiciliarCuenta,
  getCuentasBanco,
} from "../../../infraestructura.ts";
import { AltaCuentaBanco } from "./AltaCuentaBanco.tsx";
import { EdicionCuentaBanco } from "./EdicionCuentaBanco.tsx";

const metaTablaCuentasBanco = [
  { id: "descripcion", cabecera: "Descripcion" },
  { id: "iban", cabecera: "IBAN" },
  { id: "bic", cabecera: "BIC" },
];

type Estado = "lista" | "alta" | "edicion";

interface TabCuentasBancoProps {
  cliente: HookModelo<Cliente>;
  emitirCliente: EmitirEvento;
  recargarCliente: () => void;
}

export const TabCuentasBanco = ({
  cliente,
  recargarCliente,
}: TabCuentasBancoProps) => {
  const { modelo } = cliente;
  const cuentas = useLista<CuentaBanco>([]);
  const [cargando, setCargando] = useState(true);
  const [estado, setEstado] = useState<Estado>("lista");
  const { intentar } = useContext(ContextoError);

  const setListaCuentas = cuentas.setLista;

  const cargarCuentas = useCallback(async () => {
    setCargando(true);
    const nuevasCuentas = await getCuentasBanco(modelo.id);
    setListaCuentas(nuevasCuentas);
    setCargando(false);
  }, [modelo.id, setListaCuentas]);

  useEffect(() => {
    if (modelo.id) cargarCuentas();
  }, [modelo.id, cargarCuentas]);

  const maquina: Maquina<Estado> = {
    lista: {
      alta_solicitada: "alta",
      edicion_solicitada: "edicion",
      cuenta_seleccionada: (payload: unknown) => {
        const cuenta = payload as CuentaBanco;
        cuentas.seleccionar(cuenta);
      },
      borrado_solicitado: async () => {
        if (!cuentas.seleccionada) return;
        const idCuenta = cuentas.seleccionada?.id;
        if (!idCuenta) return;
        await intentar(() => deleteCuentaBanco(modelo.id, idCuenta));
        cuentas.eliminar(cuentas.seleccionada);
      },
      domiciliar_solicitada: async () => {
        if (!cuentas.seleccionada) return;
        const idCuenta = cuentas.seleccionada?.id;
        if (!idCuenta) return;
        await intentar(() => domiciliarCuenta(modelo.id, idCuenta));
        recargarCliente();
      },
      desmarcar_domiciliacion: async () => {
        await intentar(() => desmarcarCuentaDomiciliacion(modelo.id));
        recargarCliente();
      },
    },
    alta: {
      cuenta_creada: async (payload: unknown) => {
        const nuevaCuenta = payload as CuentaBanco;
        cuentas.añadir(nuevaCuenta);
        return "lista" as Estado;
      },
      alta_cancelada: "lista",
    },
    edicion: {
      cuenta_actualizada: async (payload: unknown) => {
        const cuentaActualizada = payload as CuentaBanco;
        cuentas.modificar(cuentaActualizada);
        return "lista" as Estado;
      },
      edicion_cancelada: "lista",
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  return (
    <div className="CuentasBanco">
      <div className="detalle-cliente-tab-contenido">
        <div className="CuentaBancoDomiciliacion maestro-botones">
          <span>Domiciliar: {modelo.descripcion_cuenta}</span>
          <QBoton onClick={() => emitir("desmarcar_domiciliacion")}>
            Desmarcar
          </QBoton>
        </div>
      </div>
      <div className="CuentasBanco">
        <div className="CuentasBancoAcciones">
          <div className="CuentasBancoBotonesIzquierda maestro-botones">
            <QBoton onClick={() => emitir("alta_solicitada")}>Nueva</QBoton>
            <QBoton
              onClick={() =>
                cuentas.seleccionada && emitir("edicion_solicitada")
              }
              deshabilitado={!cuentas.seleccionada}
            >
              Editar
            </QBoton>
            <QBoton
              onClick={() => emitir("borrado_solicitado")}
              deshabilitado={!cuentas.seleccionada}
            >
              Borrar
            </QBoton>
          </div>
          <div className="CuentasBancoBotonDerecha maestro-botones">
            <QBoton
              onClick={() => emitir("domiciliar_solicitada")}
              deshabilitado={!cuentas.seleccionada}
            >
              Cuenta de domiciliación
            </QBoton>
          </div>
        </div>
        <QTabla
          metaTabla={metaTablaCuentasBanco}
          datos={cuentas.lista}
          cargando={cargando}
          seleccionadaId={cuentas.seleccionada?.id}
          onSeleccion={(cuenta) => emitir("cuenta_seleccionada", cuenta)}
          orden={["id", "ASC"]}
          onOrdenar={() => null}
        />
      </div>

      <QModal
        nombre="altaCuentaBanco"
        abierto={estado === "alta"}
        onCerrar={() => emitir("alta_cancelada")}
      >
        <AltaCuentaBanco clienteId={modelo.id} emitir={emitir} />
      </QModal>

      <QModal
        nombre="edicionCuentaBanco"
        abierto={estado === "edicion"}
        onCerrar={() => emitir("edicion_cancelada")}
      >
        {cuentas.seleccionada && (
          <EdicionCuentaBanco
            clienteId={modelo.id}
            cuenta={cuentas.seleccionada}
            emitir={emitir}
          />
        )}
      </QModal>
    </div>
  );
};
