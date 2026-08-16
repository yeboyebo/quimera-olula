import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { Presupuesto } from "../diseño.ts";
import { metaPresupuesto, presupuestoVacio } from "../detalle/detalle.ts";
import { CambiarDireccionPresupuesto } from "../detalle/TabCliente/CambiarDireccionPresupuesto.tsx";

vi.mock("#/comun/componentes/pais/pais.tsx", () => ({
  PaisSelector: () => null,
}));

const presupuestoConClienteNoRegistrado = (): Presupuesto => ({
  ...presupuestoVacio(),
  id: "PRE001",
  cliente: {
    cliente_id: null,
    nombre_cliente: "Cliente de paso",
    id_fiscal: "B12345678",
    direccion_id: null,
    direccion: {
      nombre_via: "Gran Vía",
      tipo_via: "Calle",
      numero: "5",
      otros: "",
      cod_postal: "18001",
      ciudad: "Granada",
      provincia_id: 18,
      provincia: "Granada",
      pais_id: "ES",
      apartado: "",
      telefono: "958000000",
    },
  },
});

const Anfitrion = ({
  publicar,
}: {
  publicar: (evento: string, payload?: unknown) => void;
}) => {
  const presupuesto: HookModelo<Presupuesto> = useModelo(
    metaPresupuesto,
    presupuestoConClienteNoRegistrado()
  );

  return (
    <CambiarDireccionPresupuesto
      presupuesto={presupuesto}
      publicar={publicar}
      onCerrar={() => {}}
    />
  );
};

describe("Cambiar dirección de presupuesto con cliente no registrado", () => {
  test("conserva lo escrito al salir del campo", async () => {
    render(<Anfitrion publicar={() => {}} />);

    const ciudad = await screen.findByLabelText(/Ciudad/);
    await userEvent.clear(ciudad);
    await userEvent.type(ciudad, "Motril");
    await userEvent.tab();

    expect(ciudad).toHaveValue("Motril");
  });

  test("publica el cambio de cliente con la dirección editada", async () => {
    const publicar = vi.fn();
    render(<Anfitrion publicar={publicar} />);

    const ciudad = await screen.findByLabelText(/Ciudad/);
    await userEvent.clear(ciudad);
    await userEvent.type(ciudad, "Motril");

    await userEvent.click(screen.getByText("Guardar"));

    expect(publicar).toHaveBeenCalledWith(
      "cliente_cambiado",
      expect.objectContaining({
        cliente_id: "",
        nombre_cliente: "Cliente de paso",
        id_fiscal: "B12345678",
        nombre_via: "Gran Vía",
        ciudad: "Motril",
        provincia: "Granada",
      })
    );
    expect(publicar.mock.calls[0][1]).not.toHaveProperty("provincia_id");
  });
});
