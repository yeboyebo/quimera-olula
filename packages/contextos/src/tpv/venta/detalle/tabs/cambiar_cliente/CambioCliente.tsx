import { VentaTpv } from "#/tpv/venta/diseño.ts";
import { patchVentaClienteNoRegistrado, patchVentaClienteRegistrado } from "#/tpv/venta/infraestructura.ts";
import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput, QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useState } from "react";
import "./CambioCliente.css";
import { CambioClienteNoRegistrado, cambioClienteNoRegistradoVacio, CambioClienteRegistrado, cambioClienteRegistradoVacio, metaCambioClienteNoRegistrado, metaCambioClienteRegistrado } from "./cambio_cliente.ts";

export const CambiarCliente = ({
    publicar = async() => {},
    venta,
}: {
    venta: VentaTpv;
    publicar?: EmitirEvento;
}) => {

    const [tipoCliente, setTipoCliente] = useState<"registrado" | "no-registrado">(
        venta.cliente_id
            ? "registrado"
            : "no-registrado"
    );

    const toggleTipo = () => {
        setTipoCliente(tipoCliente === "registrado" ? "no-registrado" : "registrado");
    };

    // const cambioClienteInicial = venta.cliente_id
    //     ? {
    //         idCliente: venta.cliente_id,
    //         idDireccion: venta.direccion_id,
    //     }
    //     : cambioClienteRegistradoVacio
        
    // const { modelo, uiProps, valido } = useModelo(
    //     metaCambioClienteRegistrado,
    //     cambioClienteInicial
    // );

    const cancelar = () => {
        publicar("cambio_cliente_cancelado");
    };

    const guardarClienteRegistrado = async(cliente: CambioClienteRegistrado) => {
        await patchVentaClienteRegistrado(venta.id, {
            id: cliente.idCliente,
            idDireccion: cliente.idDireccion
        })
        publicar("cliente_cambiado", cliente);
    }

    const guardarClienteNoRegistrado = async(cliente: CambioClienteNoRegistrado) => {
        await patchVentaClienteNoRegistrado(venta.id, {
            nombre: cliente.nombre,
            idFiscal: cliente.idFiscal,
            direccion: {
                nombreVia: cliente.nombreVia,
                codPostal: cliente.codPostal,
                ciudad: cliente.ciudad ?? '',
                provincia: cliente.provincia ?? '',
                idProvincia: cliente.idProvincia ?? '',
                idPais: cliente.idPais ?? '',

            }
        })
        publicar("cliente_cambiado", cliente);
    }

    return (
        <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
            <h2>Cambiar cliente</h2>

            <QBoton texto={tipoCliente === "registrado" ? "No registrado" : "Registrado"}
                onClick={toggleTipo}
            />

            {tipoCliente === "registrado" 
                ? <CambiarClienteRegistrado
                    venta={venta}
                    aceptar={guardarClienteRegistrado}
                    cancelar={cancelar}
                />
                : <CambiarClienteNoRegistrado
                    venta={venta}
                    aceptar={guardarClienteNoRegistrado}
                    cancelar={cancelar}
                />
            }
        </QModal>
    );
};

export const CambiarClienteRegistrado = ({
    venta,
    aceptar,
    cancelar,
}: {
    venta: VentaTpv;
    aceptar: (c: CambioClienteRegistrado) => void;
    cancelar: () => void;
}) => {

    const cambioClienteInicial = venta.cliente_id
        ? {
            idCliente: venta.cliente_id,
            idDireccion: venta.direccion_id,
            nombre: venta.nombre_cliente
        }
        : cambioClienteRegistradoVacio
        
    const { modelo, uiProps, valido } = useModelo(
        metaCambioClienteRegistrado,
        cambioClienteInicial
    );

    return (
        <>
            <quimera-formulario>
                <Cliente
                {...uiProps("idCliente", "nombre")}
                nombre="cambiar_cliente_presupuesto"
                />
                <DirCliente
                clienteId={modelo.idCliente}
                {...uiProps("idDireccion")}
                />
            </quimera-formulario>

            <div className="botones maestro-botones ">
                <QBoton texto="Cancelar"
                    onClick={cancelar}
                />
                <QBoton texto="Guardar"
                    onClick={() => aceptar(modelo)}
                    deshabilitado={!valido}
                />
            </div>
        </>
    );
};


export const CambiarClienteNoRegistrado = ({
    venta,
    aceptar,
    cancelar,
}: {
    venta: VentaTpv;
    aceptar: (c: CambioClienteNoRegistrado) => void;
    cancelar: () => void;
}) => {

    const cambioClienteInicial = venta.cliente_id
        ? cambioClienteNoRegistradoVacio
        : {
            nombre: venta.nombre_cliente,
            idFiscal: venta.id_fiscal,
            nombreVia: venta.direccion.nombre_via,
            codPostal: venta.direccion.cod_postal,
        };
        
    const { modelo, uiProps, valido } = useModelo(
        metaCambioClienteNoRegistrado,
        cambioClienteInicial
    );

    return (
        <>
            <quimera-formulario>
                <QInput label="Nombre"
                    {...uiProps("nombre")}
                />
                <QInput label="DNI/NIF"
                    {...uiProps("idFiscal")}
                />
                <QInput label="Direccion"
                    {...uiProps("nombreVia")}
                />
                <QInput label="C.Postal"
                    {...uiProps("codPostal")}
                />
            </quimera-formulario>

            <div className="botones maestro-botones ">
                <QBoton texto="Cancelar"
                    onClick={cancelar}
                />
                <QBoton texto="Guardar"
                    onClick={() => aceptar(modelo)}
                    deshabilitado={!valido}
                />
            </div>
        </>
    );
};