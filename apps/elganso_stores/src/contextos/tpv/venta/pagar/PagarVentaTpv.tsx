import { getTpvConfig } from "#/tpv/comun/dominio.ts";
import { TipoTarjetaTpv } from "#/tpv/comun/componentes/TipoTarjetaTpv.tsx";
import { ValeTpv } from "#/tpv/vale/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { formatearMoneda, formatearNumero, redondeaMoneda } from "@olula/lib/dominio.js";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { VentaTpv } from "../diseño.ts";
import {
  getTarjetaMonedero,
  getTopePuntos,
  getVale,
  patchGenerarCodigoReal,
  postPago,
  TarjetaMonedero,
  TopePuntos,
} from "../infraestructura.ts";
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

  const [importeEfectivo, setImporteEfectivo] = useState(0);
  const [importeTarjeta, setImporteTarjeta] = useState(pendiente);
  const [importePuntos, setImportePuntos] = useState(0);
  const [importeVale, setImporteVale] = useState(0);
  const [importeTarjetaRegalo, setImporteTarjetaRegalo] = useState(0);

  // Igual que en el ERP: Tarjeta empieza con el pendiente completo (se
  // asume que se paga todo con tarjeta salvo que se diga lo contrario), no
  // Efectivo. En cuanto se usa otra forma de pago, Tarjeta baja solo lo
  // justo para que la suma nunca se pase del pendiente — si no, sobraba
  // "cambio" de más sin sentido, solo por no haber tocado el campo. Se
  // deja de tocar en cuanto el usuario edita el campo a mano (o pulsa
  // "Limpiar tarjeta"): a partir de ahí se respeta su importe tal cual.
  // Efectivo, en cambio, nunca se autoajusta — es el único que puede
  // superar el pendiente y dar cambio real (billete grande entregado).
  const [tarjetaTocada, setTarjetaTocada] = useState(false);

  const [hasTiposTarjeta, setHasTiposTarjeta] = useState(false);
  const [idTipoTarjeta, setIdTipoTarjeta] = useState<string | null>(null);

  // Genera el código secuencial real de la venta (sustituye el
  // provisional "#<id>") en cuanto se entra a pagar, antes de crear
  // ningún pago — los pagos ya tienen que llevar ese código. Idempotente
  // en el backend, así que no pasa nada si el componente se remonta.
  useEffect(() => {
    patchGenerarCodigoReal(venta.id);
  }, [venta.id]);

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

  const [tarjetaRegalo, setTarjetaRegalo] = useState<TarjetaMonedero | null>(null);
  const [codigoTarjetaRegalo, setCodigoTarjetaRegalo] = useState("");

  const buscarTarjetaRegalo = async (coduso: string) => {
    if (!coduso) return;

    const encontrada = await intentar(() => getTarjetaMonedero(coduso));

    if (!encontrada.encontrada || encontrada.saldoPendiente == null) {
      setError({
        nombre: "Tarjeta regalo",
        descripcion: `No se ha encontrado ninguna tarjeta regalo con el código ${coduso}.`,
      });
      return;
    }

    if (encontrada.saldoPendiente <= 0) {
      setError({
        nombre: "Tarjeta regalo",
        descripcion: `La tarjeta regalo ${coduso} ya está agotada, no tiene saldo disponible.`,
      });
      return;
    }

    setTarjetaRegalo(encontrada);
    setCodigoTarjetaRegalo(coduso);
    setImporteTarjetaRegalo(
      redondeaMoneda(Math.min(encontrada.saldoPendiente, pendienteRestante), venta.divisa_id)
    );
  };

  const limpiarTarjetaRegalo = () => {
    setTarjetaRegalo(null);
    setCodigoTarjetaRegalo("");
    setImporteTarjetaRegalo(0);
  };

  // Solo efectivo puede superar el pendiente (da cambio) — el resto de
  // formas de pago, entre todas, no pueden superarlo.
  const exacto = redondeaMoneda(
    importeTarjeta + importePuntos + importeVale + importeTarjetaRegalo, venta.divisa_id
  );

  // Lo que cubren las demás formas de pago sin contar Tarjeta — sirve para
  // autoajustar Tarjeta sin depender de su propio valor (si no, sería
  // circular).
  const sinTarjeta = redondeaMoneda(
    importeEfectivo + importePuntos + importeVale + importeTarjetaRegalo, venta.divisa_id
  );

  useEffect(() => {
    if (tarjetaTocada) return;
    setImporteTarjeta(redondeaMoneda(Math.max(0, pendienteRestante - sinTarjeta), venta.divisa_id));
  }, [tarjetaTocada, sinTarjeta, pendienteRestante, venta.divisa_id]);

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
    if (
      importeTarjetaRegalo > 0 && tarjetaRegalo?.saldoPendiente != null &&
      importeTarjetaRegalo > tarjetaRegalo.saldoPendiente
    ) {
      return "El importe de la tarjeta regalo no puede superar su saldo disponible";
    }
    return null;
  }, [exacto, total, pendienteRestante, importePuntos, tope, importeVale, vale, importeTarjetaRegalo, tarjetaRegalo]);

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
      if (importeTarjetaRegalo > 0) {
        await postPago(venta.id, {
          importe: importeTarjetaRegalo, formaPago: "TARJETA_REGALO", coduso: codigoTarjetaRegalo,
        });
        setYaCobrado((v) => redondeaMoneda(v + importeTarjetaRegalo, venta.divisa_id));
        setImporteTarjetaRegalo(0);
      }
    }, () => setPagando(false));
    publicar("pago_hecho");
  }, [
    importeEfectivo, importeTarjeta, importePuntos, importeVale, importeTarjetaRegalo,
    idTipoTarjeta, vale, codigoTarjetaRegalo, venta.id, venta.divisa_id, intentar, publicar, error, setError,
  ]);

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
          <QInput
            label="Efectivo"
            nombre="efectivo"
            tipo="moneda"
            divisa={venta.divisa_id}
            valor={String(importeEfectivo)}
            onChange={(v) => setImporteEfectivo(Math.max(0, Number(v) || 0))}
          />

          <div className="campo-tarjeta">
            <QInput
              label="Tarjeta"
              nombre="tarjeta"
              tipo="moneda"
              divisa={venta.divisa_id}
              valor={String(importeTarjeta)}
              onChange={(v) => {
                setTarjetaTocada(true);
                setImporteTarjeta(
                  redondeaMoneda(Math.max(0, Math.min(Number(v) || 0, pendienteRestante)), venta.divisa_id)
                );
              }}
            />
            {hasTiposTarjeta && importeTarjeta > 0 && (
              <TipoTarjetaTpv
                valor={idTipoTarjeta ?? ""}
                onChange={(opcion) => setIdTipoTarjeta(opcion?.valor ?? null)}
              />
            )}

            <div className="botones maestro-botones ">
              <QBoton
                onClick={() => {
                  setTarjetaTocada(true);
                  setImporteTarjeta(0);
                }}
              >
                Limpiar tarjeta
              </QBoton>
            </div>
          </div>

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

          <div className="campo-tarjeta-regalo">
            {tarjetaRegalo && (
              <div id="tarjeta-regalo-codigo">
                {`Tarjeta regalo: ${codigoTarjetaRegalo} (saldo ${formatearMoneda(tarjetaRegalo.saldoPendiente ?? 0, venta.divisa_id)})`}
              </div>
            )}

            {!tarjetaRegalo && (
              <QInput
                label="Tarjeta regalo"
                nombre="tarjeta_regalo_coduso"
                valor={codigoTarjetaRegalo}
                onChange={(valor) => setCodigoTarjetaRegalo(String(valor ?? ""))}
                onEnterKeyUp={(codigo) => buscarTarjetaRegalo(codigo)}
              />
            )}

            {tarjetaRegalo && (
              <QInput
                label="Importe tarjeta regalo"
                nombre="tarjeta_regalo_importe"
                tipo="moneda"
                divisa={venta.divisa_id}
                valor={String(importeTarjetaRegalo)}
                onChange={(v) =>
                  setImporteTarjetaRegalo(
                    redondeaMoneda(
                      Math.max(0, Math.min(Number(v) || 0, pendienteRestante, tarjetaRegalo.saldoPendiente ?? 0)),
                      venta.divisa_id
                    )
                  )
                }
              />
            )}

            {!tarjetaRegalo && (
              <QBoton onClick={() => buscarTarjetaRegalo(codigoTarjetaRegalo)} deshabilitado={!codigoTarjetaRegalo}>
                Buscar tarjeta regalo
              </QBoton>
            )}
            {tarjetaRegalo && <QBoton onClick={limpiarTarjetaRegalo}>Quitar tarjeta regalo</QBoton>}
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
