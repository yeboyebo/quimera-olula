import { OrdenAlmacen } from "#/almacen/orden/diseño.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { LeerPickSubcajaPalet } from "../leer_pick/LeerPickSubcajaPalet.tsx";

export const LeerPickOrden = ({
    orden,
    publicar,
}: {
    orden: OrdenAlmacen;
    publicar: EmitirEvento;
}) => {
    switch (orden.pasosPick) {
        case "LOTE-CAJAS":
            return <LeerPickSubcajaPalet orden={orden} publicar={publicar} />;
        default:
            return null;
    }
};
