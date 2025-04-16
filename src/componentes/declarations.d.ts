export interface NodoComun {
    id?: string;
    children?: ReactNode;
    key?: string;
}

declare namespace React {
    namespace JSX {
        interface IntrinsicElements {
            'etiquetas-filtro': NodoComun;
            'menu-lateral': NodoComun;
        }
    }
}
