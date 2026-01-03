import { VentaTpv } from "#/tpv/ventaTpv/diseño.ts";
import { postEmitirVale } from "#/tpv/ventaTpv/infraestructura.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { HookModelo } from "@olula/lib/useModelo.js";
import { useContext, useEffect } from "react";

export const EmisionVale = ({
  publicar,
  venta,
  activo = false,
}: {
  publicar: EmitirEvento;
  venta: HookModelo<VentaTpv>;
  activo?: boolean;
}) => {

  const { intentar } = useContext(ContextoError);

  const emitirVale = async () => {
    console.log("emitir vale");
    await intentar(() => postEmitirVale(venta.modelo));
    publicar("vale_emitido");
  };

  useEffect(() => {
    if (activo) {
      emitirVale();
    }
  }, [activo]);

  return (
     <>
     </>
  );
};
