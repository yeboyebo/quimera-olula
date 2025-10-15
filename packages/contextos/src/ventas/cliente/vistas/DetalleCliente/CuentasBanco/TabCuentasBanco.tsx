import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { QuimeraAcciones } from "@olula/componentes/index.js";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useLista } from "@olula/lib/useLista.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useEffect, useState } from "react";
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

  const acciones = [
    {
      texto: "Editar",
      onClick: () => cuentas.seleccionada && emitir("edicion_solicitada"),
      deshabilitado: !cuentas.seleccionada,
    },
    {
      texto: "Borrar",
      onClick: () => emitir("borrado_solicitado"),
      deshabilitado: !cuentas.seleccionada,
    },
    {
      texto: "Cuenta de domiciliación",
      onClick: () => emitir("domiciliar_solicitada"),
      deshabilitado: !cuentas.seleccionada,
    },
    {
      texto: "Desmarcar domiciliación",
      onClick: () => emitir("desmarcar_domiciliacion"),
    },
  ];

  return (
    <div className="CuentasBanco">
      <div className="detalle-cliente-tab-contenido maestro-botones">
        <QBoton onClick={() => emitir("alta_solicitada")}>Nueva</QBoton>
        <QuimeraAcciones acciones={acciones} vertical />
      </div>
      <div className="CuentasBanco">
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
