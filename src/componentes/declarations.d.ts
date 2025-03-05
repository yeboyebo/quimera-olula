declare module 'quimera-boton';
declare module 'quimera-input';

declare namespace React {
    namespace JSX {
        interface IntrinsicElements {
            'quimera-boton': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'quimera-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}
