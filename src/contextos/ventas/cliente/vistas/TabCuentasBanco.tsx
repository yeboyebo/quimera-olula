import { useCallback, useEffect, useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QForm } from "../../../../componentes/atomos/qform.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QTabla } from "../../../../componentes/atomos/qtabla.tsx";
import {
  Accion,
  EstadoObjetoValor,
  quitarEntidadDeLista,
  refrescarSeleccionada,
} from "../../../comun/dominio.ts";
import { Cliente, CuentaBanco } from "../diseño.ts";
import {
  deleteCuentaBanco,
  desmarcarCuentaDomiciliacion,
  getCuentasBanco,
  patchCuentaBanco,
  postCuentaBanco,
} from "../infraestructura.ts";
import "./DetalleCliente.css";

const metaTablaCuentasBanco = [
  { id: "descripcion", cabecera: "Descripcion" },
  { id: "id", cabecera: "id", visible: false },
  { id: "iban", cabecera: "IBAN" },
  { id: "bic", cabecera: "BIC" },
];

interface TabCuentasBancoProps {
  cliente: EstadoObjetoValor<Cliente>;
  dispatch: (action: Accion<Cliente>) => void;
  onEntidadActualizada: (entidad: Cliente) => void;
}

export const TabCuentasBanco = ({ cliente }: TabCuentasBancoProps) => {
  const [modo, setModo] = useState<"lista" | "alta" | "edicion">("lista");
  const [cuentas, setCuentas] = useState<CuentaBanco[]>([]);
  const [seleccionada, setSeleccionada] = useState<CuentaBanco | null>(null);
  const [estado, setEstado] = useState({} as Record<string, string>);
  const [cargando, setCargando] = useState(true);

  const cargarCuentas = useCallback(async () => {
    setCargando(true);
    const cuentas = await getCuentasBanco(cliente.valor.id);
    setCuentas(cuentas);
    refrescarSeleccionada(cuentas, seleccionada?.id, (e) =>
      setSeleccionada(e as CuentaBanco | null)
    );
    setCargando(false);
  }, [cliente.valor.id, seleccionada?.id]);

  useEffect(() => {
    if (cliente.valor.id) cargarCuentas();
  }, [cliente.valor.id, cargarCuentas]);

  const validarCuenta = (datos: Record<string, string>) => {
    return {
      iban: datos.iban.trim() === "" ? "El IBAN es obligatorio." : "",
      bic: datos.bic.trim() === "" ? "El BIC es obligatorio." : "",
      cuenta: datos.cuenta.trim() === "" ? "Nombre es obligatorio." : "",
    };
  };

  const onDomiciliarCuenta = async () => {};

  const onGuardarNuevaCuenta = async (datos: Record<string, string>) => {
    const nuevoEstado = validarCuenta(datos);
    setEstado(nuevoEstado);

    if (Object.values(nuevoEstado).some((v) => v.length > 0)) return;

    await postCuentaBanco(cliente.valor.id, datos.cuenta);
    // setCuentas([nuevaCuenta, ...cuentas]);
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

      await patchCuentaBanco(cliente.valor.id, cuentaActualizada);
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

    await deleteCuentaBanco(cliente.valor.id, seleccionada.id);
    setCuentas(quitarEntidadDeLista<CuentaBanco>(cuentas, seleccionada));
    setSeleccionada(null);
  };

  const onCancelar = () => {
    setSeleccionada(null);
    setModo("lista");
  };

  const desmarcarCuentaDomiciliada = async () => {
    if (!cliente.valor.id) return;

    await desmarcarCuentaDomiciliacion(cliente.valor.id);
  };

  return (
    <>
      <div className="detalle-cliente-tab-contenido">
        <div className="CuentaBancoDomiciliacion">
          <span>Domiciliar: {cliente.valor.cuenta_domiciliada}</span>
          <button onClick={() => desmarcarCuentaDomiciliada()}>
            Desmarcar
          </button>
        </div>
      </div>
      <div className="CuentasBanco">
        <div className="CuentasBancoAcciones">
          <div className="CuentasBancoBotonesIzquierda">
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
          </div>
          <div className="CuentasBancoBotonDerecha">
            <button onClick={onDomiciliarCuenta}>
              Cuenta de domiciliación
            </button>
          </div>
        </div>
        <QTabla
          metaTabla={metaTablaCuentasBanco}
          datos={cuentas}
          cargando={cargando}
          seleccionadaId={seleccionada?.id}
          onSeleccion={setSeleccionada}
          orden={{ id: "ASC" }}
          onOrdenar={
            (_: string) => null
            //   setOrden({ [clave]: orden[clave] === "ASC" ? "DESC" : "ASC" })
          }
        />
      </div>

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
                  label="Cuenta"
                  nombre="cuenta"
                  erroneo={!!estado.cuenta && estado.cuenta.length > 0}
                  textoValidacion={estado.cuenta}
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
