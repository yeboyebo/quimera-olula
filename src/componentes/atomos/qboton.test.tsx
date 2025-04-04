import { render, screen } from "@testing-library/react";
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
});
