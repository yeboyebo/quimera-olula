import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { MetaTabla, QIcono } from "@olula/componentes/index.js";
import { CuentaBanco } from "../../diseño.ts";
import { metaTablaCuentasBanco as metaTablaBase } from "./dominio.ts";
import "./TabCuentasBancoLista.css";

export const TabCuentasBancoLista = ({
  cuentas,
  seleccionada,
  emitir,
  cargando,
  cuentaDomiciliadaId,
}: {
  clienteId: string;
  cuentas: CuentaBanco[];
  seleccionada: CuentaBanco | null;
  emitir: (evento: string, payload?: unknown) => void;
  cargando: boolean;
  cuentaDomiciliadaId: string;
}) => {
  const metaTablaCuentasBanco = [
    {
      id: "domiciliada",
      cabecera: "",
      render: (cuenta: CuentaBanco) =>
        cuenta.id === cuentaDomiciliadaId ? (
          <div className="cuenta-domiciliada-badge">
            <QIcono
              nombre="check"
              tamaño="sm"
              color="var(--color-exito-oscuro)"
            />
          </div>
        ) : null,
    },
    ...metaTablaBase,
  ] as MetaTabla<CuentaBanco>;

  return (
    <div className="CuentasBanco">
      <QTabla
        metaTabla={metaTablaCuentasBanco}
        datos={cuentas}
        cargando={cargando}
        seleccionadaId={seleccionada?.id}
        onSeleccion={(cuenta) => emitir("cuenta_seleccionada", cuenta)}
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
    </div>
  );
};
