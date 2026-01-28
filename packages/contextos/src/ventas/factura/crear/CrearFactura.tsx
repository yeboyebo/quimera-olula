import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useContext } from "react";
import { crearFacturaRegistrada, ModeloAltaFacturaNoRegistrada, ModeloAltaFacturaRegistrada } from "./alta_factura.ts";
import { AltaFactura } from "./AltaFactura.tsx";
import "./CrearFactura.css";

export const CrearFactura = ({
    publicar = async () => {},
}: {
    publicar?: EmitirEvento;
}) => {

    const { intentar } = useContext(ContextoError);

    const cancelar = () => {
        publicar("creacion_factura_cancelada");
    };

    const guardar = async(alta: ModeloAltaFacturaNoRegistrada | ModeloAltaFacturaRegistrada) => {
        
        if ('idCliente' in alta) {
            const registrada = alta as ModeloAltaFacturaRegistrada
            await intentar(() => crearFacturaRegistrada(registrada))
            publicar("factura_creada", registrada);

        } else {
            throw new Error("No implementado");
        }
    }

    return (
        <AltaFactura
            guardar={guardar}
            cancelar={cancelar}
        />
    );
}

