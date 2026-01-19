# UseFocus

Permite indicar mediante una ref cuál es el campo que tendrá el foco al mostrarse el componente.

Parámetros:

+ seleccionado: (boolean, valor por defecto _false_).Indica si además del foco, el texto del control estará seleccionado.

Ejemplo:

```js
const focus = useFocus();  

return (
    // ...

        <Articulo 
            {...uiProps('referencia', "descripcion")}
            nombre="referencia_nueva_linea_pedido"
            ref={focus}
        />
        <QInput label="Cantidad" {...uiProps("cantidad")} />
        // ...
)
```