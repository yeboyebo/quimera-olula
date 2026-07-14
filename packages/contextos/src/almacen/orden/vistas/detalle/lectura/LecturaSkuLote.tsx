import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useFocus } from "@olula/lib/useFocus.js";
import { getSkuLote } from "../../../infraestructura.ts";

interface SkuLoteResultado {
    sku: string;
    descripcion: string;
    loteId: string | null;
}

export const LecturaSkuLote = ({
    onLectura,
}: {
    onLectura: (resultado: SkuLoteResultado) => void;
}) => {
    const focus = useFocus();

    const leerCodigo = async (codigo: string) => {
        if (!codigo) return;
        const resultado = await getSkuLote(codigo);
        onLectura(resultado);
    };

    return (
        <QInput
            label="Código de barras"
            nombre="codigoBarras"
            valor=""
            onEnterKeyUp={leerCodigo}
            ref={focus}
        />
    );
};
