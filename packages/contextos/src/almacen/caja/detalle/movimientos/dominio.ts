import { Articulo } from "#/almacen/articulo/diseño.ts";
import { leerCodBarras } from "#/almacen/articulo/infraestructura.ts";
import { ProcesarContexto } from "@olula/lib/diseño.js";
import { accionesListaEntidades, ProcesarListaEntidades } from "@olula/lib/ListaEntidades.js";
import { Caja, MovimientoCaja } from "../../diseño.ts";
import {
    deleteLineaCaja,
    getMovimientosCaja,
    postLineaCaja,
} from "../../infraestructura.ts";
import { ContextoMovimientos, EstadoMovimientos } from "./diseño.ts";

type ProcesarMovimientos = ProcesarContexto<EstadoMovimientos, ContextoMovimientos>;

const conMovimientos = (fn: ProcesarListaEntidades<MovimientoCaja>) =>
    (ctx: ContextoMovimientos) => ({ ...ctx, movimientos: fn(ctx.movimientos) });

export const Movimientos = accionesListaEntidades(conMovimientos);

const extraerContexto = (resultado: unknown): ContextoMovimientos => {
    return Array.isArray(resultado)
        ? (resultado[0] as ContextoMovimientos)
        : (resultado as ContextoMovimientos);
};

export const sincronizarCaja: ProcesarMovimientos = async (contexto, payload) => {
    const cajaId = (payload as string) || "";
    if (!cajaId) return contexto;

    const contextoLimpio: ContextoMovimientos = {
        ...contexto,
        estado: "lista",
        cajaId,
        cargando: true,
        movimientos: {
            ...contexto.movimientos,
            lista: [],
            total: 0,
            activo: null,
        },
        formulario: {
            codBarras: "",
            cantidad: "1",
        },
    };

    const { datos } = await getMovimientosCaja(cajaId);
    const resultadoRecarga = await Movimientos.recargar(contextoLimpio, {
        datos,
        total: datos.length,
    });
    const contextoActualizado = extraerContexto(resultadoRecarga);

    return {
        ...contextoActualizado,
        cajaId,
        cargando: false,
    };
};

export const crearLineaCaja: ProcesarMovimientos = async (contexto, payload) => {
    const { caja, cajaId: cajaIdPayload, codBarras, cantidad } = payload as {
        caja: Caja;
        cajaId?: string;
        codBarras: string;
        cantidad: string;
    };

    if (!codBarras || !cantidad) return contexto;

    // Leer código de barras
    const articulo: Articulo = await leerCodBarras(codBarras);

    // Crear línea
    await postLineaCaja(caja, articulo.id, cantidad);

    // Recargar movimientos de la caja actual del contexto
    const cajaId = cajaIdPayload || contexto.cajaId || caja.id;
    const { datos } = await getMovimientosCaja(cajaId);
    const resultadoRecarga = await Movimientos.recargar(contexto, {
        datos,
        total: datos.length,
    });
    const contextoActualizado = extraerContexto(resultadoRecarga);

    return [
        {
            ...contextoActualizado,
            estado: "lista",
            cajaId,
            cargando: false,
            formulario: {
                codBarras: "",
                cantidad: "1",
            },
        },
        [["linea_creada"]],
    ];
};

export const seleccionarMovimiento: ProcesarMovimientos = async (
    contexto,
    payload
) => {
    const movimiento = payload as MovimientoCaja;
    return Movimientos.activar(contexto, movimiento);
};

export const borrarMovimiento: ProcesarMovimientos = async (contexto) => {
    const movimiento = contexto.movimientos.activo;
    if (!movimiento) return contexto;

    await deleteLineaCaja(movimiento.id);

    const { datos } = await getMovimientosCaja(contexto.cajaId);
    const resultadoRecarga = await Movimientos.recargar(contexto, {
        datos,
        total: datos.length,
    });
    const contextoActualizado = extraerContexto(resultadoRecarga);

    return {
        ...contextoActualizado,
        estado: "lista",
        cargando: false,
    };
};
