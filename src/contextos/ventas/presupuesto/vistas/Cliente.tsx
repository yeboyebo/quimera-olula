import { useEffect, useState } from "react";
import {
    Input
} from "../../../../componentes/detalle/FormularioGenerico";

import { Presupuesto } from "../diseño.ts";
import { camposPresupuesto, patchCambiarCliente } from "../infraestructura.ts";
interface ClienteProps {
    presupuesto: Presupuesto;
    onClienteCambiadoCallback: (cliente: Cliente) => void;
}

interface Cliente {
    cliente_id: string;
    direccion_id: string;
}




export const Cliente = ({
    presupuesto,
    onClienteCambiadoCallback,
  }: ClienteProps) => {

    const [modoLectura, setModoLectura] = useState(true);

    useEffect(
        () => {
            setModoLectura(true);
        }
        , [presupuesto]
    );

    return modoLectura
        ? <ClienteLectura
            presupuesto={presupuesto} 
            onEditarCallback={() => setModoLectura(false)}
        />
        : <ClienteEdicion
            presupuesto={presupuesto} 
            onClienteCambiadoCallback={onClienteCambiadoCallback}
            canceladoCallback={() => setModoLectura(true)}
        />
  };

const ClienteLectura = (
    {
        presupuesto,
        onEditarCallback,
    } : {
        presupuesto: Presupuesto;
        onEditarCallback: () => void;
    }
) => {

    return  (
    <>
        <label>{presupuesto.cliente_id}: {presupuesto.nombre_cliente}</label>
        <label>{presupuesto.direccion.nombre_via}: {presupuesto.direccion.ciudad}</label>
        <button
            onClick={onEditarCallback}
        >
            Editar
        </button>
    </>
    )
    
};


const ClienteEdicion = (
    {
        presupuesto,
        onClienteCambiadoCallback,
        canceladoCallback,
    }: {
        presupuesto: Presupuesto;
        onClienteCambiadoCallback: (cliente: Cliente) => void;
        canceladoCallback: () => void;
    }
) => {
    
    const [cliente, setCliente] = useState<Cliente>({
        cliente_id: presupuesto.cliente_id,
        direccion_id: presupuesto.direccion_id,
    });

    const [guardando, setGuardando] = useState(false);

    useEffect(
        () => {
            setCliente({
                cliente_id: cliente.cliente_id,
                direccion_id: cliente.direccion_id,
            });
        },
        [presupuesto]
    );

    const onClienteCambiado = (campo: string, valor: any) => {
        const clienteNuevo = {
            ...cliente,
            [campo]: valor,
        };
        setCliente(clienteNuevo);
    }


    const guardarClienteClicked = async() => {
        setGuardando(true);
        await patchCambiarCliente(presupuesto.id, cliente.cliente_id, cliente.direccion_id);
        setGuardando(false);
        onClienteCambiadoCallback(cliente)
    }
    
    return (
        <>
            <Input
                controlado={true}
                campo={camposPresupuesto.cliente_id}
                onCampoCambiado={onClienteCambiado}
                valorEntidad={cliente.cliente_id}
                // validador={tipoClienteValido}
            />
            <Input
                controlado={true}
                campo={camposPresupuesto.direccion_id}
                onCampoCambiado={onClienteCambiado}
                valorEntidad={cliente.direccion_id}
            />
            <button
                // disabled={guardando || !ClienteValidoGeneral(Cliente.tipo_id_fiscal, Cliente.id_fiscal)}
                onClick={guardarClienteClicked}
            >
                { guardando ? 'Guardando' : 'Guardar' }
            </button>
            <button
                onClick={canceladoCallback}
            >
                Cancelar
            </button>
        </>
    );
};