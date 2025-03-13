declare module 'quimera-boton';
declare module 'quimera-input';
declare module 'quimera-select';

interface NodoComun {
    id?: string;
    children?: ReactNode;
}

interface QuimeraBoton extends NodoComun {
    tipo?: string;
    variante?: "solido" | "borde" | "texto";
    tamaño?: "pequeño" | "mediano" | "grande";
    destructivo?: boolean;
    deshabilitado?: boolean;
    onClick?: (e: MouseEvent) => void;
}

interface QuimeraInput extends NodoComun {
    nombre: string;
    label: string;
    placeholder?: string;
    valor?: string;
    erroneo?: boolean;
    advertido?: boolean;
    valido?: boolean;
    opcional?: boolean;
    deshabilitado?: boolean;
    "texto-validacion"?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

type QuimeraSelect = QuimeraInput;

declare namespace React {
    namespace JSX {
        interface IntrinsicElements {
            'quimera-boton': QuimeraBoton;
            'quimera-input': QuimeraInput;
            'quimera-select': QuimeraSelect;
            'quimera-tabla': NodoComun;
        }
    }
}
