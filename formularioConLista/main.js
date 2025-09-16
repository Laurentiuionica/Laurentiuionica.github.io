class Persona {
    constructor(nombre, apellidos, fechaNacimiento, localidad, direccion) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.fechaNacimiento = new Date(fechaNacimiento);
        this.localidad = localidad;
        this.direccion = direccion;
    }

    obtenerEdad() {
        const hoy = new Date();
        const edad = hoy.getFullYear() - this.fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - this.fechaNacimiento.getMonth();
        return (mes < 0 || (mes === 0 && hoy.getDate() < this.fechaNacimiento.getDate())) ? edad - 1 : edad;
    }

    nombreCompleto() {
        return `${this.nombre} ${this.apellidos}`;
    }
}

function formatearFecha(fecha) {
    const d = new Date(fecha);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}