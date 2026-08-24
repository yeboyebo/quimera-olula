import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { ListaEntidades } from "@olula/lib/ListaEntidades.ts";
import { BorrarLineaAlbaran } from "../../borrar_linea/BorrarLineaAlbaran.tsx";
import { CambiarLineaAlbaran } from "../../cambiar_linea/CambiarLineaAlbaran.tsx";
import { CrearLineaAlbaran } from "../../crear_linea/CrearLineaAlbaran.tsx";
import { Albaran, LineaAlbaran } from "../../diseño.ts";
import { albaranFacturado } from "../../dominio.ts";
import { EstadoDetalleAlbaran } from "../diseño.ts";
import { LineasLista } from "./LineasLista.tsx";

export const LineasAlbaran = ({
    albaran,
    lineas,
    estado,
    publicar,
}: {
    albaran: Albaran;
    lineas: ListaEntidades<LineaAlbaran>;
    estado: EstadoDetalleAlbaran;
    publicar: EmitirEvento;
}) => {
    const activa = lineas.activo;
    // Un albarán facturado rechaza con 409 crear, borrar o cambiar líneas.
    const editable = !albaranFacturado(albaran);

    return (
        <>
            <div className="botones maestro-botones">
                <QBoton
                    onClick={() => publicar("alta_linea_solicitada")}
                    deshabilitado={!editable}
                >
                    Nueva línea
                </QBoton>
                <QBoton
                    onClick={() => publicar("cambio_linea_solicitado")}
                    deshabilitado={!activa || !editable}
                >
                    Editar
                </QBoton>
                <QBoton
                    onClick={() => publicar("baja_linea_solicitada")}
                    deshabilitado={!activa || !editable}
                    advertencia
                >
                    Borrar
                </QBoton>
            </div>
            <LineasLista
                lineas={lineas.lista}
                divisa={albaran.divisaId}
                seleccionada={activa?.id}
                publicar={publicar}
            />
            {estado === "CREANDO_LINEA" && (
                <CrearLineaAlbaran albaran={albaran} publicar={publicar} />
            )}
            {activa && estado === "CAMBIANDO_LINEA" && (
                <CambiarLineaAlbaran albaran={albaran} linea={activa} publicar={publicar} />
            )}
            {activa && estado === "BORRANDO_LINEA" && (
                <BorrarLineaAlbaran albaran={albaran} linea={activa} publicar={publicar} />
            )}
        </>
    );
};
