declare module 'quimera-boton';
declare module 'quimera-input';

declare namespace React {
    namespace JSX {
        interface IntrinsicElements {
            'quimera-boton': {
                children?: ReactNode;
                tipo?: string;
                variante?: "solido" | "borde" | "texto";
                tamaño?: "pequeño" | "mediano" | "grande";
                destructivo?: boolean;
                deshabilitado?: boolean;
            };
            'quimera-input': {
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
            };
        }
    }
}
