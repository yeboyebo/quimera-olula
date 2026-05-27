import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { BotoneraJornadaBorrador } from "../detalle/BotoneraJornadaBorrador.tsx";

const noOp = vi.fn();

describe("[botonera-01] En estado Activa se muestran los botones Pausa y Stop", () => {
    test("muestra el botón Pausa", () => {
        render(<BotoneraJornadaBorrador estadoBorrador="ACTIVA" onPausa={noOp} onStop={noOp} onPlay={noOp} />);
        expect(screen.getByRole("button", { name: "Pausa" })).toBeInTheDocument();
    });

    test("muestra el botón Stop", () => {
        render(<BotoneraJornadaBorrador estadoBorrador="ACTIVA" onPausa={noOp} onStop={noOp} onPlay={noOp} />);
        expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument();
    });

    test("llama a onPausa al pulsar Pausa", async () => {
        const onPausa = vi.fn();
        render(<BotoneraJornadaBorrador estadoBorrador="ACTIVA" onPausa={onPausa} onStop={noOp} onPlay={noOp} />);
        await userEvent.click(screen.getByRole("button", { name: "Pausa" }));
        expect(onPausa).toHaveBeenCalledOnce();
    });

    test("llama a onStop al pulsar Stop", async () => {
        const onStop = vi.fn();
        render(<BotoneraJornadaBorrador estadoBorrador="ACTIVA" onPausa={noOp} onStop={onStop} onPlay={noOp} />);
        await userEvent.click(screen.getByRole("button", { name: "Stop" }));
        expect(onStop).toHaveBeenCalledOnce();
    });

    test("no muestra el botón Play", () => {
        render(<BotoneraJornadaBorrador estadoBorrador="ACTIVA" onPausa={noOp} onStop={noOp} onPlay={noOp} />);
        expect(screen.queryByRole("button", { name: "Play" })).not.toBeInTheDocument();
    });
});

describe("[botonera-02] En estado Pausada se muestra el botón Play", () => {
    test("muestra el botón Play", () => {
        render(<BotoneraJornadaBorrador estadoBorrador="PAUSADA" onPausa={noOp} onStop={noOp} onPlay={noOp} />);
        expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    });

    test("llama a onPlay al pulsar Play", async () => {
        const onPlay = vi.fn();
        render(<BotoneraJornadaBorrador estadoBorrador="PAUSADA" onPausa={noOp} onStop={noOp} onPlay={onPlay} />);
        await userEvent.click(screen.getByRole("button", { name: "Play" }));
        expect(onPlay).toHaveBeenCalledOnce();
    });

    test("no muestra los botones Pausa ni Stop", () => {
        render(<BotoneraJornadaBorrador estadoBorrador="PAUSADA" onPausa={noOp} onStop={noOp} onPlay={noOp} />);
        expect(screen.queryByRole("button", { name: "Pausa" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Stop" })).not.toBeInTheDocument();
    });
});

describe("[botonera-03] En estado Cerrada o sin estado no se muestra la botonera", () => {
    test("no muestra ningún botón cuando estadoBorrador es CERRADA", () => {
        render(<BotoneraJornadaBorrador estadoBorrador="CERRADA" onPausa={noOp} onStop={noOp} onPlay={noOp} />);
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    test("no muestra ningún botón cuando estadoBorrador es null", () => {
        render(<BotoneraJornadaBorrador estadoBorrador={null} onPausa={noOp} onStop={noOp} onPlay={noOp} />);
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
});
