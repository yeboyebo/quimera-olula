import { useCallback, useEffect, useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QForm } from "../../../../componentes/atomos/qform.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { Tabla } from "../../../../componentes/wrappers/tabla2.tsx";
import {
  quitarEntidadDeLista,
  refrescarSeleccionada,
} from "../../../comun/dominio.ts";
import { CuentaBanco } from "../diseño.ts";
import {
  deleteCuentaBanco,
  getCuentasBanco,
  patchCuentaBanco,
  postCuentaBanco,
} from "../infraestructura.ts";

const metaTablaCuentasBanco = [
  { id: "iban", cabecera: "IBAN" },
  { id: "bic", cabecera: "BIC" },
];

export const TabCuentasBanco = ({ clienteId }: { clienteId: string }) => {
  const [modo, setModo] = useState<"lista" | "alta" | "edicion">("lista");
  const [cuentas, setCuentas] = useState<CuentaBanco[]>([]);
  const [seleccionada, setSeleccionada] = useState<CuentaBanco | null>(null);
  const [estado, setEstado] = useState({} as Record<string, string>);
  const [cargando, setCargando] = useState(true);

  const cargarCuentas = useCallback(async () => {
    setCargando(true);
    const cuentas = await getCuentasBanco(clienteId);
    setCuentas(cuentas);
    refrescarSeleccionada(cuentas, seleccionada?.id, (e) =>
      setSeleccionada(e as CuentaBanco | null)
    );
    setCargando(false);
  }, [clienteId, seleccionada?.id]);

  useEffect(() => {
    if (clienteId) cargarCuentas();
  }, [clienteId, cargarCuentas]);

  const validarCuenta = (datos: Record<string, string>) => {
    return {
      iban: datos.iban.trim() === "" ? "El IBAN es obligatorio." : "",
      bic: datos.bic.trim() === "" ? "El BIC es obligatorio." : "",
    };
  };

  const onGuardarNuevaCuenta = async (datos: Record<string, string>) => {
    const nuevoEstado = validarCuenta(datos);
    setEstado(nuevoEstado);

    if (Object.values(nuevoEstado).some((v) => v.length > 0)) return;

    const nuevaCuenta: CuentaBanco = {
      id: crypto.randomUUID(),
      iban: datos.iban,
      bic: datos.bic,
    };

    await postCuentaBanco(clienteId, nuevaCuenta);
    setCuentas([nuevaCuenta, ...cuentas]);
    setModo("lista");
  };

  const onGuardarEdicionCuenta = async (datos: Record<string, string>) => {
    const nuevoEstado = validarCuenta(datos);
    setEstado(nuevoEstado);

    if (Object.values(nuevoEstado).some((v) => v.length > 0)) return;

    if (seleccionada) {
      const cuentaActualizada: CuentaBanco = {
        ...seleccionada,
        iban: datos.iban,
        bic: datos.bic,
      };

      await patchCuentaBanco(clienteId, cuentaActualizada);
      setCuentas(
        cuentas.map((cuenta) =>
          cuenta.id === seleccionada.id ? cuentaActualizada : cuenta
        )
      );
      setSeleccionada(null);
      setModo("lista");
    }
  };

  const onBorrarCuenta = async () => {
    if (!seleccionada) return;

    await deleteCuentaBanco(clienteId, seleccionada.id);
    setCuentas(quitarEntidadDeLista<CuentaBanco>(cuentas, seleccionada));
    setSeleccionada(null);
  };

  const onCancelar = () => {
    setSeleccionada(null);
    setModo("lista");
  };

  return (
    <>
      {modo === "lista" && (
        <>
          <h2>Cuentas Bancarias</h2>
          <button onClick={() => setModo("alta")}>Nueva</button>
          <button
            onClick={() => seleccionada && setModo("edicion")}
            disabled={!seleccionada}
          >
            Editar
          </button>
          <button onClick={onBorrarCuenta} disabled={!seleccionada}>
            Borrar
          </button>
          <Tabla
            metaTabla={metaTablaCuentasBanco}
            datos={cuentas}
            cargando={cargando}
            seleccionadaId={seleccionada?.id}
            onSeleccion={setSeleccionada}
            orden={{ id: "ASC" }}
            onOrdenar={() => null}
          />
        </>
      )}

      {modo === "alta" && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={onCancelar}>
              &times;
            </span>
            <h2>Nueva Cuenta Bancaria</h2>
            <QForm onSubmit={onGuardarNuevaCuenta} onReset={onCancelar}>
              <section>
                <QInput
                  label="IBAN"
                  nombre="iban"
                  erroneo={!!estado.iban && estado.iban.length > 0}
                  textoValidacion={estado.iban}
                />
                <QInput
                  label="BIC"
                  nombre="bic"
                  erroneo={!!estado.bic && estado.bic.length > 0}
                  textoValidacion={estado.bic}
                />
              </section>
              <section>
                <QBoton tipo="submit">Guardar</QBoton>
                <QBoton tipo="reset" variante="texto">
                  Cancelar
                </QBoton>
              </section>
            </QForm>
          </div>
        </div>
      )}

      {modo === "edicion" && seleccionada && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={onCancelar}>
              &times;
            </span>
            <h2>Editar Cuenta Bancaria</h2>
            <QForm onSubmit={onGuardarEdicionCuenta} onReset={onCancelar}>
              <section>
                <QInput
                  label="IBAN"
                  nombre="iban"
                  valor={seleccionada.iban}
                  erroneo={!!estado.iban && estado.iban.length > 0}
                  textoValidacion={estado.iban}
                />
                <QInput
                  label="BIC"
                  nombre="bic"
                  valor={seleccionada.bic}
                  erroneo={!!estado.bic && estado.bic.length > 0}
                  textoValidacion={estado.bic}
                />
              </section>
              <section>
                <QBoton tipo="submit">Guardar</QBoton>
                <QBoton tipo="reset" variante="texto">
                  Cancelar
                </QBoton>
              </section>
            </QForm>
          </div>
        </div>
      )}
    </>
  );
};
