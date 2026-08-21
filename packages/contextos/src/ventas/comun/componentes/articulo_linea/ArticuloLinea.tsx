import { Articulo } from "#/almacen/comun/componentes/Articulo.tsx";
import { QIcono, QInput } from "@olula/componentes/index.js";
import { useRef } from "react";
import "./ArticuloLinea.css";

export type CamposArticuloLinea = {
    tipoArticulo: "registrado" | "libre" | "generico";
    referencia: string | null;
    descripcionArticulo: string | null;
    descripcion: string | null;
};

interface ArticuloLineaProps extends CamposArticuloLinea {
    nombre?: string;
    onChange: (cambios: Partial<CamposArticuloLinea>) => void;
    ref?: React.RefObject<HTMLInputElement | null>;
}

export const ArticuloLinea = ({
    tipoArticulo,
    referencia,
    descripcionArticulo,
    descripcion,
    nombre = "referencia",
    onChange,
}: ArticuloLineaProps) => {
    const refArticulo = useRef<HTMLInputElement | null>(null);
    const refDescripcionRegistrado = useRef<HTMLInputElement | null>(null);
    const refDescripcionLibre = useRef<HTMLInputElement | null>(null);

    const toggleDescripcion = () => {
        const nuevoTipo = tipoArticulo === "registrado" ? "generico" : "registrado";
        onChange({ tipoArticulo: nuevoTipo });
        if (tipoArticulo === "generico") {
            setTimeout(() => {
                refDescripcionRegistrado.current?.focus();
                refDescripcionRegistrado.current?.select();
            }, 0);
        }
    };

    const abrir = () => {
        onChange({ tipoArticulo: "libre", referencia: null, descripcionArticulo: null, descripcion: null });
        setTimeout(() => refDescripcionLibre.current?.focus(), 0);
    };

    const cerrar = () => {
        onChange({ tipoArticulo: "registrado", referencia: null, descripcionArticulo: null, descripcion: null });
        setTimeout(() => refArticulo.current?.focus(), 0);
    };

    if (tipoArticulo !== "libre") {
        return (
            <>
                <div className="ArticuloLinea-campo">
                    <Articulo
                        valor={referencia ?? ""}
                        descripcion={descripcionArticulo ?? ""}
                        nombre={nombre}
                        onChange={(opcion) =>
                            onChange({
                                referencia: opcion?.valor ?? null,
                                descripcionArticulo: opcion?.descripcion ?? null,
                            })
                        }
                        ref={refArticulo}
                    />
                    {referencia && (
                        <button
                            type="button"
                            onClick={toggleDescripcion}
                            title="Editar descripción"
                            aria-label="Editar descripción"
                            className="ArticuloLinea-boton-candado"
                        >
                            <QIcono nombre="editar_2" tamaño="sm" />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={abrir}
                        title="Abrir descripción libre"
                        aria-label="Abrir descripción libre"
                        className="ArticuloLinea-boton-candado"
                    >
                        <QIcono nombre="candado_abierto" tamaño="sm" />
                    </button>
                </div>
                {tipoArticulo === "generico" && (
                    <QInput
                        nombre="descripcion"
                        label="Descripción"
                        valor={descripcion ?? ""}
                        onChange={(val) => onChange({ descripcion: val || null })}
                        ref={refDescripcionRegistrado}
                    />
                )}
            </>
        );
    }

    return (
        <div className="ArticuloLinea-campo">
            <QInput
                nombre="descripcion"
                label="Descripción"
                valor={descripcion ?? ""}
                onChange={(val) => onChange({ descripcion: val || null })}
                ref={refDescripcionLibre}
            />
            <button
                type="button"
                onClick={cerrar}
                title="Cerrar descripción libre"
                aria-label="Cerrar descripción libre"
                className="ArticuloLinea-boton-candado"
            >
                <QIcono nombre="candado" tamaño="sm" />
            </button>
        </div>
    );
};
