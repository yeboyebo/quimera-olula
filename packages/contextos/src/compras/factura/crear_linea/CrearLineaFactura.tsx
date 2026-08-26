import { ArticuloLinea } from "#/compras/comun/componentes/articulo_linea/ArticuloLinea.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo } from "react";
import { Factura } from "../diseño.ts";
import { metaNuevaLineaFactura, nuevaLineaFacturaVacia } from "../dominio.ts";
import { postLineaFactura } from "../infraestructura.ts";

export const CrearLineaFactura = ({
    factura,
    publicar,
}: {
    factura: Factura;
    publicar: EmitirEvento;
}) => {
    const inicial = useMemo(nuevaLineaFacturaVacia, []);
    const { modelo, uiProps, valido, set } = useModelo(metaNuevaLineaFactura, inicial);

    const crear_ = useCallback(async () => {
        const idLinea = await postLineaFactura(factura.id, modelo);
        publicar("linea_creada", idLinea);
    }, [modelo, factura.id, publicar]);

    const cancelar_ = useCallback(
        () => publicar("alta_de_linea_cancelada"),
        [publicar]
    );

    const [crear, cancelar] = useForm(crear_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="crearLineaFacturaCompra"
            titulo="Crear línea"
            onCerrar={cancelar}
        >
            <div className="CrearLineaFactura">
                <quimera-formulario>
                    <ArticuloLinea
                        tipoArticulo={modelo.tipoArticulo}
                        referencia={modelo.referencia}
                        descripcionArticulo={modelo.descripcionArticulo}
                        descripcion={modelo.descripcion}
                        nombre="referenciaNuevaLineaFacturaCompra"
                        onChange={(cambios) => set({ ...modelo, ...cambios })}
                        autoFocus
                    />
                    <QInput label="Cantidad" {...uiProps("cantidad")} />
                    <QInput label="Coste unitario" {...uiProps("pvpUnitario")} />
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={crear} deshabilitado={!valido}>
                        Crear
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
