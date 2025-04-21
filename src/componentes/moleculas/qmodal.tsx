import { PropsWithChildren, useEffect, useRef } from "react";
import { QBoton } from "../atomos/qboton.tsx";
import "./qmodal.css";

type QModalProps = {
  nombre: string;
  abierto?: boolean;
  onCerrar?: () => void;
};

export const QModal = ({
  nombre,
  abierto = false,
  onCerrar = () => {},
  children,
}: PropsWithChildren<QModalProps>) => {
  const refModal = useRef<HTMLDialogElement>(null);
  const attrs = { nombre };

  useEffect(() => {
    const modal = refModal.current;
    if (!modal) return;

    if (!abierto) {
      modal.close();
      return;
    }

    modal.showModal();
  }, [abierto]);

  useEffect(() => {
    const modal = refModal.current;
    if (!modal) return;

    const manejarClose = () => {
      onCerrar?.();
    };

    const manejarClick = (e: MouseEvent, modal: HTMLDialogElement) => {
      if (!modal) return;

      if (e.target === modal) {
        return modal.close();
      }
    };

    modal.addEventListener("close", manejarClose);
    modal.addEventListener("click", (e) => manejarClick(e, modal));

    return () => {
      modal.removeEventListener("close", manejarClose);
      modal.removeEventListener("click", (e) => manejarClick(e, modal));
    };
  }, [onCerrar]);

  return (
    <quimera-modal {...attrs}>
      <dialog ref={refModal}>
        <header>
          <form method="dialog">
            <QBoton tamaño="grande" variante="texto" tipo="submit">
              &times;
            </QBoton>
          </form>
        </header>
        <main>{children}</main>
      </dialog>
    </quimera-modal>
  );
};
