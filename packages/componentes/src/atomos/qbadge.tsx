import "./qbadge.css";

type BadgeVariante = "exito" | "error" | "advertencia" | "primario";

interface QBadgeProps {
  variante?: BadgeVariante;
  tamaño?: "sm" | "md";
  className?: string;
}

export const QBadge = ({
  variante = "primario",
  tamaño = "sm",
  className = "",
  children,
}: React.PropsWithChildren<QBadgeProps>) => {
  return (
    <span className={`q-badge ${variante} ${tamaño} ${className}`}>
      {children}
    </span>
  );
};
