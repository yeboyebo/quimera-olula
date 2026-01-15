import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, Entidad, ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos, EstadoModelo, initEstadoModelo, MetaModelo, publicar, stringNoVacio } from "@olula/lib/dominio.js";
import { idFiscalValido, tipoIdFiscalValido } from "../../valores/idfiscal.ts";
import { Cliente, ContextoCliente, ContextoMaestroCliente, CrmContacto, CuentaBanco, DirCliente, EstadoCliente, EstadoMaestroCliente, FormBaja, NuevaCuentaBanco, NuevaDireccion, NuevoCliente, NuevoCrmContacto } from "./diseño.ts";
import {
    darDeAltaCliente,
    darDeBajaCliente,
    deleteCliente,
    getCliente,
    getClientes,
    patchCliente,
    postCliente,
} from "./infraestructura.ts";

export const metaTablaCliente: MetaTabla<Cliente> = [
    { id: "id", cabecera: "Id" },
    { id: "nombre", cabecera: "Nombre" },
    { id: "email", cabecera: "Email" },
    { id: "telefono1", cabecera: "Teléfono", tipo: "texto" },
    {
        id: "id_fiscal",
        cabecera: "Id Fiscal",
        render: (entidad: Entidad) =>
            `${entidad.tipo_id_fiscal}: ${entidad.id_fiscal}`,
    },
];

export const idFiscalValidoGeneral = (tipo: string, valor: string) => {
    return idFiscalValido(tipo)(valor) && tipoIdFiscalValido(tipo) === true;
}

export const puedoMarcarDireccionFacturacion = (direccion: DirCliente) => {
    return !direccion.dir_facturacion;
}


export const clienteVacio = (): Cliente => ({
    id: '',
    nombre: '',
    nombre_comercial: null,
    id_fiscal: '',
    agente_id: null,
    nombre_agente: null,
    divisa_id: '',
    tipo_id_fiscal: '',
    serie_id: '',
    forma_pago_id: '',
    grupo_iva_negocio_id: '',
    de_baja: false,
    fecha_baja: null,
    grupo_id: '',
    telefono1: '',
    telefono2: '',
    email: '',
    web: '',
    observaciones: '',
    copiasfactura: 0,
    fechabaja: '',
    contacto_id: '',
    cuenta_domiciliada: '',
    descripcion_cuenta: '',
    debaja: false,
    forma_pago: '',
    divisa: '',
    grupo_iva_negocio: '',
    serie: '',
    grupo: '',
})

export const nuevoClienteVacio: NuevoCliente = {
    nombre: '',
    id_fiscal: '',
    empresa_id: '1',
    tipo_id_fiscal: '',
    agente_id: '',
}

export const nuevaDireccionVacia: NuevaDireccion = {
    nombre_via: '',
    tipo_via: '',
    ciudad: '',
}

export const nuevaCuentaBancoVacia: NuevaCuentaBanco = {
    descripcion: '',
    iban: '',
    bic: '',
}

export const nuevoCrmContactoVacio: NuevoCrmContacto = {
    nombre: '',
    email: '',
}

export const validadoresDireccion = {
    nuevaDireccion: (valor: NuevaDireccion) => (
        validadoresDireccion.tipo_via(valor.tipo_via) &&
        validadoresDireccion.nombre_via(valor.nombre_via) &&
        validadoresDireccion.ciudad(valor.ciudad)
    ),
    tipo_via: (valor: string) => stringNoVacio(valor),
    nombre_via: (valor: string) => stringNoVacio(valor),
    ciudad: (valor: string) => stringNoVacio(valor),
}

export const validadoresCliente = {
    nombre: (valor: string) => stringNoVacio(valor),
    id_fiscal: (valor: string) => stringNoVacio(valor),
    nuevoCliente: (cliente: NuevoCliente) =>
        cliente.nombre && cliente.id_fiscal,
};


export const initEstadoCliente = (cliente: Cliente): EstadoModelo<Cliente> => {
    return initEstadoModelo(cliente);
}

export const initEstadoDireccion = (direccion: DirCliente): EstadoModelo<DirCliente> => {
    return initEstadoModelo(direccion);
}


export const metaCliente: MetaModelo<Cliente> = {
    campos: {
        nombre: { requerido: true },
        id_fiscal: {
            requerido: true,
            validacion: (cliente: Cliente) => idFiscalValido(cliente.tipo_id_fiscal)(cliente.id_fiscal),
        },
        tipo_id_fiscal: {
            requerido: true,
            validacion: (cliente: Cliente) => tipoIdFiscalValido(cliente.tipo_id_fiscal),
        },
        nombre_agente: { bloqueado: true },
        email: { tipo: "email" },
        fecha_baja: { tipo: "fecha" },
        telefono1: { tipo: "telefono" },
    }
};


export const metaNuevoCliente: MetaModelo<NuevoCliente> = {
    campos: {
        nombre: { requerido: true },
        id_fiscal: {
            requerido: true,
            validacion: (cliente: NuevoCliente) => idFiscalValido(cliente.tipo_id_fiscal)(cliente.id_fiscal),
        },
        tipo_id_fiscal: {
            requerido: true,
            validacion: (cliente: NuevoCliente) => tipoIdFiscalValido(cliente.tipo_id_fiscal),
        },
    }
};

export const metaDireccion: MetaModelo<DirCliente> = {
    campos: {
        tipo_via: { requerido: true },
        nombre_via: { requerido: true },
        ciudad: { requerido: true },
    }
};

export const metaNuevaDireccion: MetaModelo<NuevaDireccion> = {
    campos: {
        nombre_via: { requerido: true },
        ciudad: { requerido: true },
    }
};

export const metaCuentaBanco: MetaModelo<CuentaBanco> = {
    campos: {
        iban: { requerido: true },
        bic: { requerido: true },
    }
};

export const metaNuevaCuentaBanco: MetaModelo<NuevaCuentaBanco> = {
    campos: {
        cuenta: { requerido: true },
    }
};

export const metaCrmContacto: MetaModelo<CrmContacto> = {
    campos: {
        nombre: { requerido: true },
        email: { requerido: true, tipo: "email" },
    }
};

export const metaNuevoCrmContacto: MetaModelo<NuevoCrmContacto> = {
    campos: {
        nombre: { requerido: true },
        email: { requerido: true, tipo: "email" },
    }
};

export const metaDarDeBaja: MetaModelo<FormBaja> = {
    campos: {
        fecha_baja: { requerido: true, tipo: "fecha" },
    }
};


export const initEstadoClienteVacio = () => initEstadoCliente(clienteVacio())


// ============================================================
// PROCESADORES DE EVENTOS PARA MÁQUINA
// ============================================================

type ProcesarCliente = ProcesarContexto<EstadoCliente, ContextoCliente>;
type ProcesarClientes = ProcesarContexto<EstadoMaestroCliente, ContextoMaestroCliente>;

const pipeCliente = ejecutarListaProcesos<EstadoCliente, ContextoCliente>;

const clienteVacioObjeto: Cliente = clienteVacio();

export const clienteVacioContexto = (): Cliente => ({ ...clienteVacioObjeto });

const cargarCliente: (_: string) => ProcesarCliente = (idCliente) =>
    async (contexto) => {
        const cliente = await getCliente(idCliente);
        return {
            ...contexto,
            cliente,
            clienteInicial: cliente,
        }
    }

export const refrescarCliente: ProcesarCliente = async (contexto) => {
    const cliente = await getCliente(contexto.cliente.id);
    return [
        {
            ...contexto,
            cliente: {
                ...contexto.cliente,
                ...cliente
            },
        },
        [["cliente_cambiado", cliente]]
    ]
}

export const cancelarCambioCliente: ProcesarCliente = async (contexto) => {
    return {
        ...contexto,
        cliente: contexto.clienteInicial
    }
}

export const abiertoContexto: ProcesarCliente = async (contexto) => {
    console.log("Abierto contexto cliente");
    return {
        ...contexto,
        estado: "ABIERTO"
    }
}

export const getContextoVacio: ProcesarCliente = async (contexto) => {
    return {
        ...contexto,
        estado: 'INICIAL',
        cliente: clienteVacioContexto(),
        clienteInicial: clienteVacioContexto(),
    }
}

export const cargarContexto: ProcesarCliente = async (contexto, payload) => {
    console.log("Cargando contexto cliente", payload);
    const idCliente = payload as string;
    if (idCliente) {
        return pipeCliente(
            contexto,
            [
                cargarCliente(idCliente),
                abiertoContexto,
            ],
            payload
        );
    } else {
        return getContextoVacio(contexto);
    }
}

export const cambiarCliente: ProcesarCliente = async (contexto, payload) => {
    const cliente = payload as Cliente;
    await patchCliente(contexto.cliente.id, cliente);

    return pipeCliente(contexto, [
        refrescarCliente,
        'ABIERTO',
    ]);
}

export const borrarCliente: ProcesarCliente = async (contexto) => {
    await deleteCliente(contexto.cliente.id);

    return pipeCliente(contexto, [
        getContextoVacio,
        publicar('cliente_borrado', null)
    ]);
}

export const darDeAltaClienteProceso: ProcesarCliente = async (contexto) => {
    await darDeAltaCliente(contexto.cliente.id);

    return pipeCliente(contexto, [
        cargarCliente(contexto.cliente.id),
        abiertoContexto,
    ]);
}

export const darDeBajaClienteProceso: ProcesarCliente = async (contexto, payload) => {
    const fechaBaja = payload as string;
    await darDeBajaCliente(contexto.cliente.id, fechaBaja);

    return pipeCliente(contexto, [
        cargarCliente(contexto.cliente.id),
        abiertoContexto,
    ]);
}

// Para el maestro

export const cambiarClienteEnLista: ProcesarClientes = async (contexto, payload) => {
    const cliente = payload as Cliente;
    return {
        ...contexto,
        clientes: contexto.clientes.map(c => c.id === cliente.id ? cliente : c)
    }
}

export const activarCliente: ProcesarClientes = async (contexto, payload) => {
    const clienteActivo = payload as Cliente;
    return {
        ...contexto,
        clienteActivo
    }
}

export const desactivarClienteActivo: ProcesarClientes = async (contexto) => {
    return {
        ...contexto,
        clienteActivo: null
    }
}

export const quitarClienteDeLista: ProcesarClientes = async (contexto, payload) => {
    const clienteBorrado = payload as Cliente;
    return {
        ...contexto,
        clientes: contexto.clientes.filter(c => c.id !== clienteBorrado.id),
        clienteActivo: null
    }
}

export const recargarClientes: ProcesarClientes = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getClientes(criteria.filtro, criteria.orden, criteria.paginacion);
    const clientesCargados = resultado.datos;

    return {
        ...contexto,
        clientes: clientesCargados,
        totalClientes: resultado.total == -1 ? contexto.totalClientes : resultado.total,
        clienteActivo: contexto.clienteActivo
            ? clientesCargados.find(c => c.id === contexto.clienteActivo?.id) ?? null
            : null
    }
}

export const incluirClienteEnLista: ProcesarClientes = async (contexto, payload) => {
    const cliente = payload as Cliente;
    return {
        ...contexto,
        clientes: [cliente, ...contexto.clientes]
    }
}

export const crearCliente: ProcesarClientes = async (contexto, payload) => {
    const clienteNuevo = payload as NuevoCliente;
    const idCliente = await postCliente(clienteNuevo);
    const cliente = await getCliente(idCliente);
    return {
        ...contexto,
        clientes: [cliente, ...contexto.clientes],
        clienteActivo: cliente
    }
}


