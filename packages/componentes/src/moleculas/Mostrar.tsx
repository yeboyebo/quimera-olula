import { QModal } from "./qmodal.tsx";

export const Mostrar = ({
  children,
  modo = "inline",
  activo = false,
  onCerrar = () => {},
}: {
  modo: "inline" | "modal";
  activo: boolean;
  children?: React.ReactNode;
  onCerrar?: () => void;
}) => {
  if (!activo) {
    return null;
  }
  if (modo === "inline") {
    return <>{children}</>;
  }

  return (
    <QModal abierto={activo} nombre='mostrar'
    onCerrar={onCerrar}
    >
      {children}
    </QModal>
  );
}