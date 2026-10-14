import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, test } from "vitest";
import { QBoton } from "./qboton.tsx";

describe("qboton", () => {
  test("renderiza", () => {
    render(<QBoton></QBoton>);
  });

  test("renderiza texto interno", () => {
    render(<QBoton>Prueba</QBoton>);

    expect(screen.getByText(/Prueba/i)).toBeDefined();
  });

  test("funciona onclick", () => {
    render(
      <>
        <p data-testids="parrafo">Hola</p>
        <QBoton onClick={() => (screen.getByText(/Hola/i).innerHTML = "Adios")}>
          Pulsa
        </QBoton>
      </>
    );

    const button = screen.getByRole("button");

    expect(screen.getByText(/Hola/i)).toBeDefined();
    fireEvent.click(button);
    expect(screen.getByText(/Adios/i)).toBeDefined();
  });

  test("con enlace se pinta como un enlace a la ruta", () => {
    render(
      <MemoryRouter>
        <QBoton enlace="/tesoreria/recibo_venta?id=7">Ver recibo</QBoton>
      </MemoryRouter>
    );

    const enlace = screen.getByRole("link", { name: "Ver recibo" });
    expect(enlace.getAttribute("href")).toBe("/tesoreria/recibo_venta?id=7");
  });
});
