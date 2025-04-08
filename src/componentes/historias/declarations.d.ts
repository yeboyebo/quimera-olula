interface NodoComun {
    id?: string;
    children?: ReactNode;
    key?: string;
    style?: React.CSSProperties;
}

declare namespace React {
    namespace JSX {
        interface IntrinsicElements {
            'quimera-historias': NodoComun;
            'qhistorias-componente': NodoComun;
            'qhistorias-historia': NodoComun;
        }
    }
}
