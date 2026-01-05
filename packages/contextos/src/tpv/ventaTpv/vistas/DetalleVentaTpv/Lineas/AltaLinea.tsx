import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useModelo } from "@olula/lib/useModelo.ts";
import {
    metaNuevaLineaFactura,
    nuevaLineaFacturaVacia,
} from "../../../dominio.ts";

import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useState } from "react";
import "./AltaLinea.css";

export const AltaLinea = ({
  publicar,
}: {
  publicar: EmitirEvento;
}) => {
    const { modelo, uiProps, valido } = useModelo(metaNuevaLineaFactura, nuevaLineaFacturaVacia);
    const [creando, setCreando] = useState(false);

    const crear = async () => {
        setCreando(true);
        publicar("alta_de_linea_lista", modelo);
    };

    const cancelar = () => {
        !creando && publicar("alta_de_linea_cancelada");
    };

    return (
        <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>

        <div className="AltaLinea">

            <h2>Crear línea</h2>

            <quimera-formulario>
                <Articulo
                    {...uiProps("referencia", "descripcion")}
                    nombre="referencia_nueva_linea_pedido"
                />
                <QInput label="Cantidad" {...uiProps("cantidad")} />
            </quimera-formulario>

            <div className="botones maestro-botones ">
                <QBoton onClick={crear} deshabilitado={!valido}>
                    Crear
                </QBoton>
            </div>

        </div>

        </QModal>
    );
};
