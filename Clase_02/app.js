// const objetos = [
//     {
//         manzanas: 3,
//         peras: 2,
//         carne: 1,
//         jugos: 5,
//         dulces: 2
//     },
//     {
//         manzanas: 1,
//         sandias: 1,
//         huevos: 6,
//         jugos: 1,
//         panes: 4
//     }
// ]

// const tiposDeProductos = objetos.reduce((lista, objeto) => {
//     Object.keys(objeto).forEach(producto => {
//         if (!lista.includes(producto)) {
//             lista.push(producto)
//         }
//     })
//     return lista
// }, [])

// console.log(tiposDeProductos)

// const totalProductosVendidos = objetos.reduce((total, objeto) => {
//     const cantidades = Object.values(objeto)
//     const suma = cantidades.reduce((a, b) => a + b, 0)
//     return total + suma
// }, 0)

// console.log(`Total de productos vendidos ${totalProductosVendidos}`)

class TicketManager {
    constructor() {
        this.eventos = []
        this.precioBaseDeGanancia = 0
    }

    getEventos() {
        return this.eventos
    }

    agregarEvento(nombre, lugar, precio, capacidad = 50, fecha = new Date()) {
        precio += precio * 0.15
        const evento_id = this.eventos.length + 1
        const participantes = []
        const evento = {
            id: evento_id,
            nombre,
            lugar,
            precio,
            capacidad,
            fecha,
            participantes
        }
        this.eventos.push(evento)
    }

    agregarUsuario(evento_id, usuario_id) {
        const evento_encontrado = this.eventos.find((evento) => evento.id === evento_id)
        if (!evento_encontrado) {
            console.log("El evento no fué encontrado")
            return
        }

        const participantes = evento_encontrado.participantes
        const usuarioRegistrado = participantes.includes(usuario_id)
        if (usuarioRegistrado) {
            console.log("El usuario ya está registrado en éste evento")
            return
        }

        participantes.push(usuario_id)
        console.log("El usuario ha sido agregado al evento")
    }

    ponerEventoEnGira(evento_id, nueva_localidad, nueva_fecha) {
        const evento_encontrado = this.eventos.find((evento) => evento.id === evento_id)
        if (!evento_encontrado) {
            console.log("El evento con el ID proporcionado no existe")
            return
        }

        const evento_copiado = { ...evento_encontrado }
        evento_copiado.id = this.eventos.length + 1
        evento_copiado.lugar = nueva_localidad
        evento_copiado.fecha = nueva_fecha
        evento_copiado.participantes = []

        this.eventos.push(evento_copiado)
        console.log("El evento ha sido puesto en gira correctamente")
    }
}

const ticketManager = new TicketManager()

//Agregar eventos
ticketManager.agregarEvento("Concierto de Rock", "Estadio Kempes", 100, 2000, new Date("2024-07-20"))
ticketManager.agregarEvento("Concierto de Pop", "Estadio Belgrano", 200, 3000, new Date("2024-10-20"))

const eventos = ticketManager.getEventos()
// console.log(eventos)

//Agregar usuarios

ticketManager.agregarUsuario(1, "usuario 1")
ticketManager.agregarUsuario(2, "usuario 2")
ticketManager.agregarUsuario(1, "usuario 3")

//Poner en gira
ticketManager.ponerEventoEnGira(1, "Microestadio Talleres", new Date("2024-12-20"))

const eventosActualizados = ticketManager.getEventos()
console.log(eventosActualizados)