const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull : false,
        validate: {
            isEmail:{
                msg: 'Agrega un correo Válido'
            },
            notEmpty: {
                msg: 'El e-mail no puede ir vacio'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya Registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull : false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacio' 
            }
        }
    },
    activo:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token:Sequelize.STRING,
    expiracion: Sequelize.DATE
},{
    hooks: { //es para encriptar "hashear" password
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

//Métodos personalizados
Usuarios.prototype.verificarPassword = function(password){ //compara la password
     return bcrypt.compareSync(password, this.password); 
}

Usuarios.hasMany(Proyectos); //es para una clave foranea para saber a q proyecto esta tabla
 
module.exports = Usuarios;