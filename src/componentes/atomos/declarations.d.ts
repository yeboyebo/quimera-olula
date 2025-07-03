interface BoxIcon extends NodoComun {
    name: string;
    size?: string;
    color?: string;
}

declare namespace React {
    namespace JSX {
        interface IntrinsicElements {
            'quimera-formulario': NodoComun;
            'quimera-boton': NodoComun;
            'quimera-date': NodoComun;
            'quimera-input': NodoComun;
            'quimera-checkbox': NodoComun;
            'quimera-select': NodoComun;
            'quimera-tabla': NodoComun;
            'quimera-textarea': NodoComun;
            'quimera-icono': NodoComun;
            'box-icon': BoxIcon;
        }
    }
}
