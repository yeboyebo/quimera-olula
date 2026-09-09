export const opcionesTipoIdFiscalCompras = [
    { valor: "NIF", descripcion: "N.I.F." },
    { valor: "NIFIVA", descripcion: "N.I.F. I.V.A." },
    { valor: "PASAPORTE", descripcion: "Pasaporte" },
    { valor: "OTRO", descripcion: "Otro" },
];

export const tipoIdFiscalCompraValido = (tipo: string): string | boolean =>
    opcionesTipoIdFiscalCompras.some((o) => o.valor === tipo) ||
    "El tipo debe ser NIF, NIFIVA, PASAPORTE u OTRO";

export const idFiscalCompraValido = (tipo: string) => (valor: string): string | boolean => {
    if (valor.length === 0) return "El id fiscal es requerido";
    if (tipo === "NIF") {
        return valor.length === 9 || "El NIF debe tener 9 caracteres";
    }
    return true;
};
