import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { CuentaBanco } from "../../../diseño.ts";

const metaTablaCuentasBanco = [
  { id: "descripcion", cabecera: "Descripcion" },
  { id: "iban", cabecera: "IBAN" },
  { id: "bic", cabecera: "BIC" },
];

export const TabCuentasBancoLista = ({
  cuentas,
  seleccionada,
  emitir,
  cargando,
}: {
  clienteId: string;
  cuentas: CuentaBanco[];
  seleccionada: CuentaBanco | null;
  emitir: (evento: string, payload?: unknown) => void;
  cargando: boolean;
}) => {
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
