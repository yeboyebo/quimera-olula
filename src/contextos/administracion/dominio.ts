import { MetaModelo } from "../comun/dominio.ts";
import { CategoriaReglas, Grupo, Permiso, Regla, ReglaAnidada, ReglaConValor } from "./diseño.ts";



export const grupoVacio: Grupo = {
    id: "",
    descripcion: "",
};

export const metaNuevoGrupo: MetaModelo<Grupo> = {
    campos: {
        id: { requerido: true },
        descripcion: { requerido: false },
    },
};


export const reglaVacia: Regla = {
    id: "",
    descripcion: "",
    grupo: "",
};

export const validadoresGrupo = {
    id: (valor: string) => valor.trim() !== "",
    descripcion: (valor: string) => valor.trim() !== "",
};

export const validadoresRegla = {
    id: (valor: string) => valor.trim() !== "",
    descripcion: (valor: string) => valor.trim() !== "",
    grupo: (valor: string) => valor.trim() !== "",
};


export const getReglasPorGrupoPermiso = (
    grupoId: string,
    reglas: Regla[],
    permisos: Permiso[]
): CategoriaReglas[] => {
    const permisosGrupo = permisos.filter(p => p.id_grupo === grupoId);

    const mapaPermisos: Record<string, boolean | null> = {};
    permisosGrupo.forEach(p => {
        mapaPermisos[p.id_regla] = p.valor;
    });

    const reglasConValor = reglas.map(regla => ({
        ...regla,
        valor: mapaPermisos[regla.id] !== undefined ? mapaPermisos[regla.id] : null
    }));

    const categorias: Record<string, CategoriaReglas> = {};

    reglasConValor.forEach(regla => {
        const partes = regla.id.split('.');
        const categoria = partes[0];
        const subnivel = partes.length > 1 ? partes[1] : null;
        const accion = partes.length > 2 ? partes[2] : null;

        if (!categorias[categoria]) {
            categorias[categoria] = {
                id: categoria,
                descripcion: regla.descripcion.split(' - ')[0],
                reglas: []
            };
        }

        // Si es una regla de primer nivel (ej: "ventas.factura")
        if (partes.length === 2 && !accion) {
            categorias[categoria].reglas.push({
                ...regla,
                hijos: []
            });
        }
        // Si es una regla de segundo nivel (ej: "ventas.factura.crear")
        else if (partes.length === 3) {
            const padre = categorias[categoria].reglas.find(r => r.id === `${categoria}.${subnivel}`);
            if (padre) {
                padre.hijos = padre.hijos || [];
                padre.hijos.push(regla);
            } else {
                // Si no existe el padre, lo creamos
                categorias[categoria].reglas.push({
                    id: `${categoria}.${subnivel}`,
                    grupo: `${categoria}.${subnivel}`,
                    descripcion: `${categoria} - ${subnivel}`,
                    eventos: [],
                    valor: null,
                    hijos: [regla]
                });
            }
        }
    });

    return Object.values(categorias);
};

export const calcularClasesExtra = (
    regla: ReglaConValor | ReglaAnidada,
    reglaPadre?: ReglaAnidada
): { permitir: string; cancelar: string } => {
    const clases = {
        permitir: "",
        cancelar: "",
    };

    if (regla.valor === null) {
        if (!reglaPadre) {
            clases.permitir = "BordeActivo";
        } else {
            if (reglaPadre.valor === false) {
                clases.cancelar = "BordeActivo";
            } else {
                clases.permitir = "BordeActivo";
            }
        }
    }

    return clases;
};