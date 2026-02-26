export const formateaCategoria = (categoria: string) => categoria + "ª"

export const formateaEstado = (estado: string) => {

    switch (estado) {
        case "1": return "Pendiente"
        case "2": return "Parcial"
        case "3": return "Preparado"
        case "4": return "Pte. envio"
        case "5": return "Enviado"
    }

}