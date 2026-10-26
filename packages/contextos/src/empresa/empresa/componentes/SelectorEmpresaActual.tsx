import { useState } from "react";
import { empresaActual, setEmpresaActual } from "../../../valores/empresaActual.ts";
import { whoAmIStorage } from "../../../auth/login/infraestructura.ts";
import "./SelectorEmpresaActual.css";

type ItemEmpresa = { id: string; nombre: string };

const empresasDeStorage = (): ItemEmpresa[] => {
    const raw = whoAmIStorage.obtener();
    if (!raw) return [];
    try {
        const whoAmI = JSON.parse(raw);
        return whoAmI.empresas ?? [];
    } catch {
        return [];
    }
};

export const SelectorEmpresaActual = () => {
    const empresas = empresasDeStorage();
    if (empresas.length <= 1) return null;

    const [actual, setActual] = useState(empresaActual());

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setEmpresaActual(id);
        setActual(id);
        window.dispatchEvent(new CustomEvent("empresa_actual_cambiada", { detail: id }));
    };

    return (
        <select className="selector-empresa-actual" value={actual} onChange={onChange} aria-label="Empresa activa">
            {empresas.map((emp) => (
                <option key={emp.id} value={emp.id}>
                    {emp.nombre}
                </option>
            ))}
        </select>
    );
};
