import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi, beforeEach } from "vitest";
import { AsistenteRuntimeProvider } from "#/asistente/vistas/AsistenteRuntimeProvider.tsx";
import { Chat } from "#/asistente/vistas/Chat.tsx";

const respuestaConDescarga = {
    respuesta: "Aquí tienes el informe.",
    threadId: "hilo-1",
    a2uiMessages: [],
    capacidadesHash: null,
    necesitaCapacidades: false,
    accionNavegacion: null,
    descarga: { url: "https://api.test/public/documental/documento/descargar/abc123", nombreFichero: "informe.pdf" },
    adjuntos: [],
    encolado: false,
};

vi.mock("#/asistente/infraestructura.ts", () => ({
    consultarIa: vi.fn(async () => respuestaConDescarga),
    consultarIaStream: vi.fn(),
    listarHilos: vi.fn(async () => []),
    obtenerMensajesHilo: vi.fn(async () => ({ threadId: "hilo-1", mensajes: [] })),
}));

beforeEach(() => {
    localStorage.clear();
    globalThis.ResizeObserver ??= class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
    Element.prototype.scrollTo ??= () => {};
});

test("[asistente-chat-descarga-01] guardar_documento muestra un botón de descarga real, no la URL en el texto", async () => {
    const abrirVentana = vi.spyOn(window, "open").mockImplementation(() => null);

    render(
        <AsistenteRuntimeProvider>
            <Chat />
        </AsistenteRuntimeProvider>
    );

    const textarea = await screen.findByPlaceholderText("Escribe un mensaje…");
    await userEvent.type(textarea, "hazme un informe de ventas");
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

    const boton = await screen.findByRole("button", { name: "Descargar" });
    expect(abrirVentana).not.toHaveBeenCalled();

    await userEvent.click(boton);

    expect(abrirVentana).toHaveBeenCalledWith(
        "https://api.test/public/documental/documento/descargar/abc123", "_blank", "noopener,noreferrer"
    );

    abrirVentana.mockRestore();
});

test("[asistente-chat-descarga-02] al reabrir un hilo (p. ej. tras recargar) se conservan los botones de descarga y navegación", async () => {
    const { obtenerMensajesHilo } = await import("#/asistente/infraestructura.ts");
    localStorage.setItem("quimera-preferencias", JSON.stringify({ "asistente.threadIdActivo": "hilo-viejo" }));
    vi.mocked(obtenerMensajesHilo).mockResolvedValueOnce({
        threadId: "hilo-viejo",
        mensajes: [
            { id: "m1-u", rol: "user", texto: "pásamelo a excel", a2uiMessages: [], adjuntos: [], descarga: null, accionNavegacion: null },
            {
                id: "m1-a", rol: "assistant", texto: "He generado el fichero.", a2uiMessages: [], adjuntos: [],
                descarga: { url: "https://api.test/public/documental/documento/descargar/xyz", nombreFichero: "ventas.xlsx" },
                accionNavegacion: null,
            },
            { id: "m2-u", rol: "user", texto: "llévame a facturas", a2uiMessages: [], adjuntos: [], descarga: null, accionNavegacion: null },
            {
                id: "m2-a", rol: "assistant", texto: "Aquí puedes verlas.", a2uiMessages: [], adjuntos: [],
                descarga: null, accionNavegacion: { ruta: "/ventas/factura", descripcion: "Facturas" },
            },
        ],
    });

    render(
        <AsistenteRuntimeProvider>
            <Chat />
        </AsistenteRuntimeProvider>
    );

    await screen.findByText("He generado el fichero.");
    expect(await screen.findByRole("button", { name: "Descargar" })).toBeTruthy();
    expect(await screen.findByRole("button", { name: /Ir a Facturas/ })).toBeTruthy();
});
