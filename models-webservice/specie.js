module.exports = class specie {

    constructor({
        id,
        nombre,
        e_nombre_comun_principal,
        e_foto_principal,
        nombre_cientifico
    }) {
        this.id = id;
        this.nombre = nombre;
        this.e_nombre_comun_principal = e_nombre_comun_principal;
        this.e_foto_principal = e_foto_principal;
        this.nombre_cientifico = nombre_cientifico;
    }
}