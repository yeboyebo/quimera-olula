import { QBoton, QInput } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { useFocus } from "@olula/lib/useFocus.js";
import { useContext, useEffect } from "react";
import { Caja } from "../diseño.ts";

export const LeerCodBarrasCaja = ({
  caja,
  cajaId,
  emitir,
  formulario,
}: {
  caja: Caja;
  cajaId: string;
  emitir: (evento: string, payload?: unknown) => void;
  formulario: {
    codBarras: string;
    cantidad: string;
  };
}) => {
  const { intentar } = useContext(ContextoError);
  const codBarrasRef = useFocus();

  useEffect(() => {
    const input = codBarrasRef.current as unknown as HTMLInputElement | null;
    input?.focus();
  }, [cajaId, codBarrasRef]);

  const handleGuardar = async () => {
    await intentar(async () => {
      await emitir("guardar_linea_solicitado", {
        caja,
        cajaId,
        codBarras: formulario.codBarras,
        cantidad: formulario.cantidad,
      });

      const input = codBarrasRef.current as unknown as HTMLInputElement | null;
      input?.focus();
    });
  };

  const manejarKeyDown = (evento: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (evento.key === "Enter" || evento.key === "Tab") &&
      formulario.codBarras.trim()
    ) {
      evento.preventDefault();
      void handleGuardar();
    }
  };

  return (
    <>
      <quimera-formulario>
        <QInput
          ref={codBarrasRef}
          label="Codigo de barras"
          tipo="texto"
          valor={formulario.codBarras}
          onChange={(v: string) =>
            emitir("formulario_cambiado", { campo: "codBarras", valor: v })
          }
          onKeyDown={manejarKeyDown}
          nombre="codigo_barras"
        />
        <QInput
          label="Cantidad"
          tipo="numero"
          valor={formulario.cantidad}
          onChange={(v: string) =>
            emitir("formulario_cambiado", { campo: "cantidad", valor: v })
          }
          nombre="cantidad_transferencia"
        />
      </quimera-formulario>
      <div className="botones maestro-botones">
        <QBoton onClick={handleGuardar}>Guardar</QBoton>
      </div>
    </>
  );
};
