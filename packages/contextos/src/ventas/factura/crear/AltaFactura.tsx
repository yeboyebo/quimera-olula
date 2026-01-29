
import { ClienteVentaNoRegistrado } from "#/ventas/comun/componentes/moleculas/ClienteVenta/ClienteVentaNoRegistrado.tsx";
import { QBoton, QInput, QModal } from "@olula/componentes/index.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useState } from "react";
import { ClienteFacturaRegistrado } from "../cliente_factura/ClienteFacturaRegistrado.tsx";
import { altaFacturaNoRegistradaVacia, altaFacturaRegistradaVacia, metaModeloAltaFacturaNoRegistrada, metaModeloAltaFacturaRegistrada, ModeloAltaFacturaNoRegistrada, ModeloAltaFacturaRegistrada } from "./alta_factura.ts";

export const AltaFactura = ({
    guardar,
    cancelar,
}: {
    guardar: (altaFactura: ModeloAltaFacturaRegistrada | ModeloAltaFacturaNoRegistrada) => void;
    cancelar: () => void;
}) => {

    const registrada = useModelo(
        metaModeloAltaFacturaRegistrada,
        altaFacturaRegistradaVacia
    );

    const noRegistrada = useModelo(
        metaModeloAltaFacturaNoRegistrada,
        altaFacturaNoRegistradaVacia
    );

    const [tipoAlta, setTipoAlta] = useState<"registrada" | "no-registrada">("registrada");

    const esRegistrada = tipoAlta === "registrada";

    const toggleTipo = () => {
        setTipoAlta(esRegistrada ? "no-registrada" : "registrada");
    };

    const alta = esRegistrada ? registrada : noRegistrada;

    return (
        <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
            <h2>Cambiar cliente</h2>

            <QBoton texto={esRegistrada ? "No registrado" : "Registrado"}
                onClick={toggleTipo}
            />

            <quimera-formulario>

                {
                    esRegistrada 
                        ? <ClienteFacturaRegistrado
                            cliente={registrada}
                        /> 
                        : <ClienteVentaNoRegistrado
                            cliente={noRegistrada}
                        />
                    
                }
                <QInput label="Empresa" {...alta.uiProps("idEmpresa")} />

            </quimera-formulario>

            <div className="botones maestro-botones ">
                <QBoton texto="Cancelar"
                    onClick={cancelar}
                />
                <QBoton texto="Guardar"
                    onClick={() => guardar(
                        tipoAlta === "registrada"
                            ? registrada.modelo
                            : noRegistrada.modelo
                    )}
                    deshabilitado={!alta.valido}
                />
            </div>

        </QModal>
    );
};

