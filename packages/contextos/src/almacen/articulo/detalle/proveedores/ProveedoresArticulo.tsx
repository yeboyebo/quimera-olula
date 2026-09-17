import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useState } from "react";
import { Articulo, CajaProveedorArticulo, ProveedorArticulo } from "../../diseño.ts";
import "./ProveedoresArticulo.css";

const FilaCaja = ({
    caja,
    proveedor,
    publicar,
}: {
    caja: CajaProveedorArticulo;
    proveedor: ProveedorArticulo;
    publicar: EmitirEvento;
}) => (
    <tr>
        <td>{caja.tipoCaja}</td>
        <td>{caja.cantidad}</td>
        <td>
            <div className="ProveedoresArticulo__acciones">
                <QBoton
                    variante="texto"
                    tamaño="pequeño"
                    props={{ title: "Editar" }}
                    onClick={() =>
                        publicar("cambio_caja_proveedor_solicitado", {
                            proveedorId: proveedor.id,
                            caja,
                        })
                    }
                >
                    <QIcono nombre="editar_2" tamaño="sm" />
                </QBoton>
                <QBoton
                    variante="texto"
                    tamaño="pequeño"
                    destructivo
                    props={{ title: "Borrar" }}
                    onClick={() =>
                        publicar("baja_caja_proveedor_solicitada", {
                            proveedorId: proveedor.id,
                            caja,
                        })
                    }
                >
                    <QIcono nombre="eliminar" tamaño="sm" />
                </QBoton>
                <QBoton
                    variante="texto"
                    tamaño="pequeño"
                    props={{ title: "Marcar como defecto" }}
                    onClick={() =>
                        publicar("caja_proveedor_defecto_solicitada", {
                            proveedorId: proveedor.id,
                            cajaId: caja.id,
                        })
                    }
                    deshabilitado={caja.esDefecto}
                >
                    <QIcono
                        nombre="estrella"
                        tamaño="sm"
                        relleno={caja.esDefecto}
                        color={caja.esDefecto ? "var(--color-primario-claro)" : undefined}
                    />
                </QBoton>
            </div>
        </td>
    </tr>
);

const SeccionProveedor = ({
    proveedor,
    publicar,
}: {
    proveedor: ProveedorArticulo;
    publicar: EmitirEvento;
}) => (
    <div className="ProveedoresArticulo__proveedor">
        <div className="ProveedoresArticulo__proveedor-cabecera">
            <strong>{proveedor.proveedor}</strong>
            <QBoton
                onClick={() =>
                    publicar("alta_caja_proveedor_solicitada", proveedor.id)
                }
            >
                Nueva caja
            </QBoton>
        </div>
        {proveedor.embalajes.length === 0 ? (
            <p>Sin embalajes</p>
        ) : (
            <table>
                <thead>
                    <tr>
                        <th>Tipo de caja</th>
                        <th>Cantidad</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {proveedor.embalajes.map((caja) => (
                        <FilaCaja
                            key={caja.id}
                            caja={caja}
                            proveedor={proveedor}
                            publicar={publicar}
                        />
                    ))}
                </tbody>
            </table>
        )}
    </div>
);

const ResumenProveedor = ({ proveedor }: { proveedor: ProveedorArticulo }) => {
    const texto =
        proveedor.embalajes.length === 0
            ? "Sin embalajes definidos"
            : proveedor.embalajes
                  .map((e) => `${e.tipoCaja} ×${e.cantidad}${e.esDefecto ? " ★" : ""}`)
                  .join(", ");
    return (
        <span className="ProveedoresArticulo__resumen-fila">
            <strong>{proveedor.proveedor}</strong>: {texto}
        </span>
    );
};

export const ProveedoresArticulo = ({
    articulo,
    publicar,
}: {
    articulo: Articulo;
    publicar: EmitirEvento;
}) => {
    const [activo, setActivo] = useState(false);

    if (articulo.proveedores.length === 0) {
        return <p>Sin proveedores asociados</p>;
    }

    return (
        <div className="ProveedoresArticulo">
            <div className="ProveedoresArticulo__cabecera">
                <h4>Embalajes por proveedor</h4>
                {activo ? (
                    <QBoton
                        variante="texto"
                        tamaño="pequeño"
                        props={{ title: "Cerrar" }}
                        onClick={() => setActivo(false)}
                    >
                        <QIcono nombre="arriba" tamaño="sm" />
                    </QBoton>
                ) : (
                    <QBoton
                        variante="texto"
                        tamaño="pequeño"
                        props={{ title: "Editar proveedores" }}
                        onClick={() => setActivo(true)}
                    >
                        <QIcono nombre="editar_2" tamaño="sm" />
                    </QBoton>
                )}
            </div>
            {activo ? (
                articulo.proveedores.map((proveedor) => (
                    <SeccionProveedor
                        key={proveedor.id}
                        proveedor={proveedor}
                        publicar={publicar}
                    />
                ))
            ) : (
                <div className="ProveedoresArticulo__resumen">
                    {articulo.proveedores.map((proveedor) => (
                        <ResumenProveedor key={proveedor.id} proveedor={proveedor} />
                    ))}
                </div>
            )}
        </div>
    );
};
