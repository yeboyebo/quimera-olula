import { ArticuloDeLinea } from "../diseño.ts";
import { articuloDeLineaValido, getTipoArticulo } from "../dominio.ts";
import { articuloLineaApi } from "../infraestructura.ts";

const registrado: ArticuloDeLinea = {
    referencia: "ART-001",
    descripcion: "Tornillo M6",
    descripcionArticulo: "Tornillo M6",
};

const generico: ArticuloDeLinea = {
    referencia: "ART-001",
    descripcion: "Tornillo M6 galvanizado",
    descripcionArticulo: "Tornillo M6",
};

const libre: ArticuloDeLinea = {
    referencia: null,
    descripcion: "Portes",
    descripcionArticulo: null,
};

describe("getTipoArticulo", () => {
    test("con referencia y la descripción del catálogo es registrado", () => {
        expect(getTipoArticulo(registrado)).toBe("registrado");
    });

    test("con referencia y descripción distinta es genérico", () => {
        expect(getTipoArticulo(generico)).toBe("generico");
    });

    test("sin referencia es libre", () => {
        expect(getTipoArticulo(libre)).toBe("libre");
    });
});

describe("articuloLineaApi", () => {
    test("registrado manda solo el id del catálogo", () => {
        expect(articuloLineaApi({ ...registrado, tipoArticulo: "registrado" })).toEqual({
            articulo_id: "ART-001",
        });
    });

    test("genérico manda el id y la descripción personalizada", () => {
        expect(articuloLineaApi({ ...generico, tipoArticulo: "generico" })).toEqual({
            articulo_id: "ART-001",
            descripcion: "Tornillo M6 galvanizado",
        });
    });

    test("libre manda solo la descripción", () => {
        expect(articuloLineaApi({ ...libre, tipoArticulo: "libre" })).toEqual({
            descripcion: "Portes",
        });
    });
});

describe("articuloDeLineaValido", () => {
    test("registrado necesita referencia", () => {
        expect(articuloDeLineaValido({ ...registrado, tipoArticulo: "registrado" })).toBe(true);
        expect(
            articuloDeLineaValido({ ...libre, tipoArticulo: "registrado" })
        ).toBe(false);
    });

    test("genérico necesita referencia y descripción", () => {
        expect(articuloDeLineaValido({ ...generico, tipoArticulo: "generico" })).toBe(true);
        expect(
            articuloDeLineaValido({ ...generico, descripcion: "", tipoArticulo: "generico" })
        ).toBe(false);
    });

    test("libre necesita descripción", () => {
        expect(articuloDeLineaValido({ ...libre, tipoArticulo: "libre" })).toBe(true);
        expect(
            articuloDeLineaValido({ ...libre, descripcion: "", tipoArticulo: "libre" })
        ).toBe(false);
    });
});
