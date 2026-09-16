import { getTpvConfig } from "#/tpv/comun/dominio.ts";
import { TipoTarjetaTpv } from "#/tpv/comun/componentes/TipoTarjetaTpv.tsx";
import { ValeTpv } from "#/tpv/vale/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { formatearMoneda, formatearNumero, redondeaMoneda } from "@olula/lib/dominio.js";
import { useFocus } from "@olula/lib/useFocus.js";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { VentaTpv } from "../diseño.ts";
import { getTopePuntos, getVale, postPago, TopePuntos } from "../infraestructura.ts";
import "./PagarVentaTpv.css";

// Pantalla única de cobro, calcada del formulario "cantidad de pago" de
// Eneboo (una sola pantalla, se rellena un importe por forma de pago y se
// aceptan todos de golpe) — pero, a diferencia de Eneboo, aquí seguimos
// creando cada pago con su propio POST /pago, uno detrás de otro, en vez de
// un comando "crear_pagos" atómico nuevo: así no hace falta tocar el
// dominio genérico de tpv/venta para conseguir la misma experiencia de
// cobro (ver [[project_el_ganso_tpv_venta_pendiente]]).
export const PagarVentaTpv = ({
  publicar,
  venta,
}: {
  publicar: EmitirEvento;
  venta: VentaTpv;
}) => {
  const pendiente = redondeaMoneda(venta.pendiente, venta.divisa_id);

  // Cuánto se ha llegado a cobrar ya en esta sesión del modal (si una
  // forma de pago falla a mitad de la secuencia, las anteriores ya se
  // crearon de verdad) — se resta del pendiente mostrado y del cálculo de
  // cambio, para que un reintento parta de la cifra real restante.
  const [yaCobrado, setYaCobrado] = useState(0);
  const pendienteRestante = redondeaMoneda(pendiente - yaCobrado, venta.divisa_id);

  const [importeEfectivo, setImporteEfectivo] = useState(pendiente);
  const [importeTarjeta, setImporteTarjeta] = useState(0);
  const [importePuntos, setImportePuntos] = useState(0);
  const [importeVale, setImporteVale] = useState(0);

  // Efectivo empieza con el pendiente completo (se asume que se paga todo
  // en efectivo salvo que se diga lo contrario). En cuanto se usa otra
  // forma de pago, efectivo baja solo lo justo para que la suma nunca se
  // pase del pendiente — si no, sobraba "cambio" de más sin sentido, solo
  // por no haber tocado el campo de efectivo. Se deja de tocar en cuanto
  // el usuario edita el campo a mano (o pulsa "Limpiar efectivo"): a
  // partir de ahí se respeta su importe tal cual, incluso si da cambio de
  // verdad (billete grande entregado).
  const [efectivoTocado, setEfectivoTocado] = useState(false);

  const [hasTiposTarjeta, setHasTiposTarjeta] = useState(false);
  const [idTipoTarjeta, setIdTipoTarjeta] = useState<string | null>(null);

  useEffect(() => {
    getTpvConfig().then((config) => {
      if (config.tiposTarjeta.length > 0) {
        setHasTiposTarjeta(true);
        const porDefecto = config.tiposTarjeta.find((t) => t.defecto);
        setIdTipoTarjeta(porDefecto?.id ?? null);
      }
    });
  }, []);

  // Igual que en el botón "P. Puntos" de antes: solo se puede pagar con
  // puntos si la venta ya tiene una tarjeta Gansociety vinculada.
  const puedePagarConPuntos = !!venta.tarjetaPuntosId;

  const [tope, setTope] = useState<TopePuntos | null>(null);

  useEffect(() => {
    if (!puedePagarConPuntos) return;
    let cancelado = false;
    getTopePuntos(venta.id).then((valor) => {
      if (!cancelado) setTope(valor);
    });
    return () => {
      cancelado = true;
    };
  }, [venta.id, puedePagarConPuntos]);

  const puntosBloqueado = tope !== null && tope.importeMaximo !== null;

  // Con tope (tarjetas de empleado/dtoespecial), autorellena con el
  // máximo y bloquea el campo, igual que hacía la pantalla anterior.
  useEffect(() => {
    if (!puntosBloqueado || tope?.importeMaximo == null) return;
    const candidatos = [tope.importeMaximo, pendienteRestante];
    if (tope.saldoDisponible !== null) candidatos.push(tope.saldoDisponible);
    setImportePuntos(Math.floor(Math.min(...candidatos) * 100) / 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puntosBloqueado, tope]);

  const { intentar, setError } = useContext(ContextoError);

  const [vale, setVale] = useState<ValeTpv | null>(null);
  const [codigoVale, setCodigoVale] = useState("");
  const focusVale = useFocus();

  const buscarVale = async (codigo: string) => {
    if (!codigo) return;

    const valeEncontrado = await intentar(() => getVale(codigo));

    if (valeEncontrado.saldo_pendiente <= 0) {
      setError({
        nombre: "Vale",
        descripcion: `El vale ${valeEncontrado.id} ya está agotado, no tiene saldo disponible.`,
      });
      return;
    }

    setVale(valeEncontrado);
    setImporteVale(redondeaMoneda(Math.min(valeEncontrado.saldo_pendiente, pendienteRestante), venta.divisa_id));
  };

  const limpiarVale = () => {
    setVale(null);
    setCodigoVale("");
    setImporteVale(0);
  };

  // Solo efectivo puede superar el pendiente (da cambio) — el resto de
  // formas de pago, entre todas, no pueden superarlo.
  const exacto = redondeaMoneda(importeTarjeta + importePuntos + importeVale, venta.divisa_id);

  useEffect(() => {
    if (efectivoTocado) return;
    setImporteEfectivo(redondeaMoneda(Math.max(0, pendienteRestante - exacto), venta.divisa_id));
  }, [efectivoTocado, exacto, pendienteRestante, venta.divisa_id]);

  const total = redondeaMoneda(importeEfectivo + exacto, venta.divisa_id);
  const cambio = redondeaMoneda(total - pendienteRestante > 0 ? total - pendienteRestante : 0, venta.divisa_id);
  // Lo que aún falta por cubrir con lo rellenado hasta ahora (a diferencia
  // de "A pagar", que es fijo mientras no se cobra nada, este baja en vivo
  // según se van rellenando los campos).
  const pendienteEnVivo = redondeaMoneda(
    pendienteRestante - total > 0 ? pendienteRestante - total : 0,
    venta.divisa_id
  );

  const error = useMemo(() => {
    if (exacto > pendienteRestante) {
      return "Entre tarjeta, puntos y vale no pueden superar el importe pendiente";
    }
    // Igual que en Eneboo: no se puede finalizar/añadir el pago si no cubre
    // el total de la venta — nada de dejarla a medias desde este formulario.
    if (total < pendienteRestante) {
      return "Se tiene que realizar el pago completo para poder finalizar la venta";
    }
    if (importePuntos > 0 && tope?.saldoDisponible != null && importePuntos > tope.saldoDisponible) {
      return "El importe de puntos no puede superar el saldo disponible";
    }
    if (importeVale > 0 && vale && importeVale > vale.saldo_pendiente) {
      return "El importe del vale no puede superar su saldo disponible";
    }
    return null;
  }, [exacto, total, pendienteRestante, importePuntos, tope, importeVale, vale]);

  const valido = total > 0;

  const [pagando, setPagando] = useState(false);

  // Cada importe se pone a 0 justo después de crear su pago con éxito: si
  // una forma de pago posterior falla, el modal se queda abierto (mismo
  // comportamiento que las pantallas individuales de antes) mostrando el
  // error, y un reintento no vuelve a mandar las que ya se crearon (su
  // campo ya está a 0, así que se saltan).
  const pagar = useCallback(async () => {
    if (error) {
      setError({ nombre: "Pago", descripcion: error });
      return;
    }
    setPagando(true);
    await intentar(async () => {
      if (importeEfectivo > 0) {
        await postPago(venta.id, { importe: importeEfectivo, formaPago: "EFECTIVO" });
        setYaCobrado((v) => redondeaMoneda(v + importeEfectivo, venta.divisa_id));
        setImporteEfectivo(0);
      }
      if (importeTarjeta > 0) {
        await postPago(venta.id, { importe: importeTarjeta, formaPago: "TARJETA", idTipoTarjeta });
        setYaCobrado((v) => redondeaMoneda(v + importeTarjeta, venta.divisa_id));
        setImporteTarjeta(0);
      }
      if (importePuntos > 0) {
        await postPago(venta.id, { importe: importePuntos, formaPago: "PUNTOS" });
        setYaCobrado((v) => redondeaMoneda(v + importePuntos, venta.divisa_id));
        setImportePuntos(0);
      }
      if (importeVale > 0) {
        await postPago(venta.id, { importe: importeVale, formaPago: "VALE", idVale: vale?.id });
        setYaCobrado((v) => redondeaMoneda(v + importeVale, venta.divisa_id));
        setImporteVale(0);
      }
    }, () => setPagando(false));
    publicar("pago_hecho");
  }, [importeEfectivo, importeTarjeta, importePuntos, importeVale, idTipoTarjeta, vale, venta.id, venta.divisa_id, intentar, publicar, error, setError]);

  const cancelar = useCallback(() => {
    if (!pagando) publicar("pago_cancelado");
  }, [pagando, publicar]);

  return (
    <QModal
      abierto={true}
      nombre="pagar_venta_tpv"
      titulo="Formulario de Pago"
      onCerrar={cancelar}
      anchoEstable
      pantallaCompletaMovil={false}
    >
      <div className="PagarVentaTpv">
        <div id="pendiente" className="resumen-pago">
          <div className="resumen-pago-item">
            <label>A pagar</label>
            <span>{formatearMoneda(pendienteRestante, venta.divisa_id)}</span>
          </div>
          <div className="resumen-pago-item">
            <label>Pendiente</label>
            <span>{formatearMoneda(pendienteEnVivo, venta.divisa_id)}</span>
          </div>
          <div className="resumen-pago-item">
            <label>Cambio</label>
            <span>{formatearMoneda(cambio, venta.divisa_id)}</span>
          </div>
        </div>

        <quimera-formulario>
          <div className="campo-efectivo">
            <QInput
              label="Efectivo"
              nombre="efectivo"
              tipo="moneda"
              divisa={venta.divisa_id}
              valor={String(importeEfectivo)}
              onChange={(v) => {
                setEfectivoTocado(true);
                setImporteEfectivo(Math.max(0, Number(v) || 0));
              }}
            />

            <div className="botones maestro-botones ">
              <QBoton
                onClick={() => {
                  setEfectivoTocado(true);
                  setImporteEfectivo(0);
                }}
              >
                Limpiar efectivo
              </QBoton>
            </div>
          </div>

          <QInput
            label="Tarjeta"
            nombre="tarjeta"
            tipo="moneda"
            divisa={venta.divisa_id}
            valor={String(importeTarjeta)}
            onChange={(v) =>
              setImporteTarjeta(
                redondeaMoneda(Math.max(0, Math.min(Number(v) || 0, pendienteRestante)), venta.divisa_id)
              )
            }
          />
          {hasTiposTarjeta && importeTarjeta > 0 && (
            <TipoTarjetaTpv
              valor={idTipoTarjeta ?? ""}
              onChange={(opcion) => setIdTipoTarjeta(opcion?.valor ?? null)}
            />
          )}

          <div className="campo-vale">
            {vale && (
              <div id="vale-codigo">{`Vale: ${vale.id} (saldo ${formatearMoneda(vale.saldo_pendiente, venta.divisa_id)})`}</div>
            )}

            {!vale && (
              <QInput
                label="Vale"
                nombre="vale_id"
                valor={codigoVale}
                onChange={(valor) => setCodigoVale(String(valor ?? ""))}
                ref={focusVale}
                onEnterKeyUp={(codigo) => buscarVale(codigo)}
              />
            )}

            {vale && (
              <QInput
                label="Importe vale"
                nombre="vale_importe"
                tipo="moneda"
                divisa={venta.divisa_id}
                valor={String(importeVale)}
                onChange={(v) =>
                  setImporteVale(
                    redondeaMoneda(
                      Math.max(0, Math.min(Number(v) || 0, pendienteRestante, vale.saldo_pendiente)),
                      venta.divisa_id
                    )
                  )
                }
              />
            )}

            {!vale && (
              <QBoton onClick={() => buscarVale(codigoVale)} deshabilitado={!codigoVale}>
                Buscar vale
              </QBoton>
            )}
            {vale && <QBoton onClick={limpiarVale}>Quitar vale</QBoton>}
          </div>

          <div className="campo-puntos">
            <QInput
              label="Puntos"
              nombre="puntos"
              tipo="moneda"
              divisa={venta.divisa_id}
              valor={String(importePuntos)}
              deshabilitado={!puedePagarConPuntos || puntosBloqueado}
              onChange={(v) =>
                setImportePuntos(
                  redondeaMoneda(Math.max(0, Math.min(Number(v) || 0, pendienteRestante)), venta.divisa_id)
                )
              }
            />
            {puedePagarConPuntos && tope?.saldoDisponible != null && (
              <div id="saldo-puntos">
                {`Saldo disponible: ${formatearNumero(tope.saldoDisponible)}`}
              </div>
            )}
          </div>
        </quimera-formulario>

        <div className="botones maestro-botones ">
          <QBoton onClick={pagar} deshabilitado={!valido}>
            Pagar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
