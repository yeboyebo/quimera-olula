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
