import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useState } from "react";
import { LineaFactura } from "../../../diseño.ts";
import { metaLineaFactura } from "../../../dominio.ts";
import "./EdicionLinea.css";

export const EdicionLinea = ({
  publicar,
  linea,
}: {
  linea: LineaFactura;
  publicar: EmitirEvento;
}) => {

    const { modelo, uiProps, valido } = useModelo(
        metaLineaFactura,
        linea
    );

    const [cambiando, setCambiando] = useState(false);

    const cambiar = () => {
        setCambiando(true);
        publicar("cambio_de_linea_listo", modelo);
    };

    const cancelar = () => {
        !cambiando && publicar("cambio_de_linea_cancelado");
    };

    return (
        <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>

        <div className="EdicionLinea">

            <h2>Cambiar línea</h2>

            <quimera-formulario>

                <div id='titulo'>
                    <h3>{`${linea.descripcion}`}</h3>
                    {`Ref: ${linea.referencia}`}
                </div>

                <QInput label="Cantidad" {...uiProps("cantidad")} />

                <div id='espacio'/>

                <QInput label="Precio" {...uiProps("pvp_unitario")} />

                <div id='espacio'/>

                <QInput label="% Descuento" {...uiProps("dto_porcentual")} />

            </quimera-formulario>

            <div className="botones maestro-botones ">

                <QBoton onClick={cambiar} deshabilitado={!valido}>
                    Cambiar
                </QBoton>
                
            </div>

        </div>

        </QModal>
    );
};
