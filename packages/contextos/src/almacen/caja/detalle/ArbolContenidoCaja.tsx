import { CajaContenido, ComponenteCaja, MovimientoCaja } from "../diseño.ts";
import { esMaterial, esSubcaja } from "./dominio.ts";

const NodoMaterial = ({ material }: { material: MovimientoCaja }) => (
    <div className="arbol-nodo arbol-material">
        <span className="arbol-material-sku">{material.sku}</span>
        <span className="arbol-material-descripcion">{material.descripcion}</span>
        <span className="arbol-material-cantidad">{material.cantidad}</span>
    </div>
);

const NodoSubcaja = ({ subcaja }: { subcaja: CajaContenido }) => (
    <details className="arbol-nodo arbol-subcaja" open>
        <summary className="arbol-subcaja-id">{subcaja.id}</summary>
        <div className="arbol-subcaja-contenido">
            {subcaja.contenido.map((comp) => (
                <NodoComponente key={comp.id} componente={comp} />
            ))}
            {subcaja.contenido.length === 0 && (
                <span className="arbol-vacio">Vacía</span>
            )}
        </div>
    </details>
);

const NodoComponente = ({ componente }: { componente: ComponenteCaja }) => {
    if (esMaterial(componente)) return <NodoMaterial material={componente} />;
    if (esSubcaja(componente)) return <NodoSubcaja subcaja={componente} />;
    return null;
};

export const ArbolContenidoCaja = ({
    contenido,
}: {
    contenido: ComponenteCaja[];
}) => (
    <div className="ArbolContenidoCaja">
        {contenido.length === 0 ? (
            <p className="arbol-vacio">Caja vacía</p>
        ) : (
            contenido.map((comp) => (
                <NodoComponente key={comp.id} componente={comp} />
            ))
        )}
    </div>
);
