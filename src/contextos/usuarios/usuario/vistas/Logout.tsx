import { useEffect } from "react";
import { useNavigate } from "react-router";
import { logout } from "../../login/dominio.ts";

export const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    logout().finally(() => {
      navigate("/login", { replace: true });
    });
  }, [navigate]);

  return null;
};
