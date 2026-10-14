import { formatearMoneda } from "@olula/lib/dominio.ts";
import { ibanLegible } from "../banca.ts";
import "./TransferenciaBancaria.css";

export type ParteTransferencia = {
    nombre: string;
    /** Se omite cuando aún no se conoce (la cuenta del cliente que paga un cobro). */
    iban?: string;
};

/**
 * Resumen de una transferencia: quién envía el dinero, quién lo recibe, cuánto
 * y con qué referencia. Se usa tanto en los cobros a clientes como en los
 * pagos a proveedores para que el sentido del dinero no deje dudas.
 */
export const TransferenciaBancaria = ({
    envia,
    recibe,
    importe,
    referencia,
}: {
    envia: ParteTransferencia;
    recibe: ParteTransferencia;
    importe: number;
    referencia?: string;
}) => (
    <dl className="TransferenciaBancaria">
        <dt>Envía el dinero</dt>
        <dd>
            <strong>{envia.nombre}</strong>
            {envia.iban && <span className="iban">{ibanLegible(envia.iban)}</span>}
        </dd>
        <dt>Recibe el dinero</dt>
        <dd>
            <strong>{recibe.nombre}</strong>
            {recibe.iban && <span className="iban">{ibanLegible(recibe.iban)}</span>}
        </dd>
        <dt>Importe</dt>
        <dd>
            <strong>{formatearMoneda(importe, "EUR")}</strong>
        </dd>
        {referencia && (
            <>
                <dt>Referencia</dt>
                <dd>{referencia}</dd>
            </>
        )}
    </dl>
);
