import { getInformeLibroFacturasEmitidas } from "../../infraestructura.ts";
import { InformeLibroFacturasIva } from "./InformeLibroFacturasIva.tsx";

export const InformeLibroFacturasEmitidas = () => (
    <InformeLibroFacturasIva
        titulo="Informe Facturas Emitidas"
        tipoPdf="libro_facturas_emitidas"
        consultar={getInformeLibroFacturasEmitidas}
        className="InformeLibroFacturasEmitidas"
    />
);
