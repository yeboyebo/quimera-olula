import { describe, expect, it } from "vitest";
import {
    OTRO_PROVEEDOR,
    buscarProveedorConocido,
    iconoProveedor,
    opcionesProveedorPorCategoria,
    proveedoresPorCategoria,
    secretoCompleto,
} from "../dominio.js";

describe("buscarProveedorConocido", () => {
    it("encuentra un proveedor conocido por su valor exacto", () => {
        expect(buscarProveedorConocido("Telegram")?.tipoAuth).toBe("api_key");
        expect(buscarProveedorConocido("Gmail")?.tipoAuth).toBe("oauth2");
        expect(buscarProveedorConocido("Correo (IMAP/SMTP)")?.tipoAuth).toBe("basic");
        expect(buscarProveedorConocido("Gemini")?.tipoAuth).toBe("api_key");
    });

    it("no encuentra nada para un proveedor libre ('Otro')", () => {
        expect(buscarProveedorConocido(OTRO_PROVEEDOR)).toBeUndefined();
        expect(buscarProveedorConocido("Cualquier cosa")).toBeUndefined();
    });
});

describe("categorías de proveedor", () => {
    it("los proveedores LLM soportados son Gemini, OpenAI, Anthropic, Mistral, Azure OpenAI y Ollama", () => {
        const llm = proveedoresPorCategoria("llm");
        expect(llm.map((p) => p.valor)).toEqual([
            "Gemini", "OpenAI", "Anthropic", "Mistral", "Azure OpenAI", "Ollama",
        ]);
    });

    it("Telegram/Gmail/Correo son 'conector'", () => {
        const conectores = proveedoresPorCategoria("conector").map((p) => p.valor);
        expect(conectores).toEqual(["Telegram", "Gmail", "Correo (IMAP/SMTP)"]);
    });

    it("'Otro' solo aparece como opción para conectores, nunca para LLM", () => {
        const opcionesLlm = opcionesProveedorPorCategoria("llm").map((o) => o.valor);
        const opcionesConector = opcionesProveedorPorCategoria("conector").map((o) => o.valor);
        expect(opcionesLlm).not.toContain(OTRO_PROVEEDOR);
        expect(opcionesConector).toContain(OTRO_PROVEEDOR);
    });

    it("iconoProveedor cae a un icono genérico para proveedores desconocidos", () => {
        expect(iconoProveedor("Telegram")).toBe("telegram");
        expect(iconoProveedor("Proveedor inventado")).toBe("ajustes");
    });
});

describe("secretoCompleto", () => {
    it("para un proveedor conocido exige sus propios campos, no los genéricos de tipoAuth", () => {
        expect(secretoCompleto("Telegram", "api_key", {})).toBe(false);
        expect(secretoCompleto("Telegram", "api_key", { api_key: "no-es-este-campo" })).toBe(false);
        expect(secretoCompleto("Telegram", "api_key", { bot_token: "123:abc" })).toBe(false);
        expect(
            secretoCompleto("Telegram", "api_key", { bot_token: "123:abc", chat_id_autorizado: "999" })
        ).toBe(true);
    });

    it("Gemini exige api_key pero no el modelo (opcional)", () => {
        expect(secretoCompleto("Gemini", "api_key", {})).toBe(false);
        expect(secretoCompleto("Gemini", "api_key", { api_key: "x" })).toBe(true);
    });

    it("OpenAI/Anthropic/Mistral exigen api_key pero no el modelo (opcional)", () => {
        for (const proveedor of ["OpenAI", "Anthropic", "Mistral"]) {
            expect(secretoCompleto(proveedor, "api_key", {})).toBe(false);
            expect(secretoCompleto(proveedor, "api_key", { api_key: "x" })).toBe(true);
        }
    });

    it("Azure OpenAI exige api_key, endpoint y despliegue, pero no la versión de API (opcional)", () => {
        const sinVersion = { api_key: "x", endpoint: "https://r.openai.azure.com", despliegue: "mi-gpt" };
        expect(secretoCompleto("Azure OpenAI", "api_key", sinVersion)).toBe(true);
        expect(secretoCompleto("Azure OpenAI", "api_key", { api_key: "x" })).toBe(false);
    });

    it("Ollama exige base_url y modelo, ninguno es opcional (sin api_key)", () => {
        expect(secretoCompleto("Ollama", "api_key", { base_url: "http://localhost:11434" })).toBe(false);
        expect(
            secretoCompleto("Ollama", "api_key", { base_url: "http://localhost:11434", modelo: "llama3.1" })
        ).toBe(true);
    });

    it("Gmail exige client_id, client_secret y refresh_token", () => {
        expect(secretoCompleto("Gmail", "oauth2", { client_id: "a", client_secret: "b" })).toBe(false);
        expect(
            secretoCompleto("Gmail", "oauth2", { client_id: "a", client_secret: "b", refresh_token: "c" })
        ).toBe(true);
    });

    it("Correo (IMAP/SMTP) exige credenciales y ambos servidores", () => {
        const completo = {
            usuario: "a@b.com",
            password: "x",
            imap_host: "imap.b.com",
            imap_puerto: "993",
            smtp_host: "smtp.b.com",
            smtp_puerto: "587",
        };
        expect(secretoCompleto("Correo (IMAP/SMTP)", "basic", completo)).toBe(true);
        const { smtp_host: _smtp_host, ...incompleto } = completo;
        expect(secretoCompleto("Correo (IMAP/SMTP)", "basic", incompleto)).toBe(false);
    });

    it("para 'Otro' cae en los campos genéricos por tipoAuth", () => {
        expect(secretoCompleto(OTRO_PROVEEDOR, "api_key", { api_key: "x" })).toBe(true);
        expect(secretoCompleto(OTRO_PROVEEDOR, "bearer", { token: "x" })).toBe(true);
        expect(secretoCompleto(OTRO_PROVEEDOR, "basic", { usuario: "a" })).toBe(false);
        expect(secretoCompleto(OTRO_PROVEEDOR, "oauth2", { client_id: "a", client_secret: "b" })).toBe(true);
    });
});
