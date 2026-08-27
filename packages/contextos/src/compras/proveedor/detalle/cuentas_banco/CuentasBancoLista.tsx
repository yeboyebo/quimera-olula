import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { CuentaBancoProveedor } from "../../diseño.ts";

const metaTablaCuentas = (cuentaPagoId: string | null): MetaTabla<CuentaBancoProveedor> => [
    {
        id: "pago",
        cabecera: "Pago",
        render: (c: CuentaBancoProveedor) => (c.id === cuentaPagoId ? "Sí" : ""),
    },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "iban", cabecera: "IBAN" },
    { id: "bic", cabecera: "BIC" },
    { id: "entidad", cabecera: "Entidad" },
    { id: "agencia", cabecera: "Agencia" },
];

export const CuentasBancoLista = ({
    cuentas,
    cuentaPagoId,
    seleccionada,
    publicar,
}: {
    cuentas: CuentaBancoProveedor[];
    cuentaPagoId: string | null;
    seleccionada?: string;
    publicar: EmitirEvento;
}) => {
    return (
        <ListadoSemiControlado
            metaTabla={metaTablaCuentas(cuentaPagoId)}
            entidades={cuentas}
            totalEntidades={cuentas.length}
            cargando={false}
            seleccionada={cuentas.find((c) => c.id === seleccionada) ?? null}
            onSeleccion={(cuenta: CuentaBancoProveedor) =>
                publicar("cuenta_seleccionada", cuenta)
            }
            criteriaInicial={criteriaDefecto}
            onCriteriaChanged={() => null}
            modo="tabla"
        />
    );
};
