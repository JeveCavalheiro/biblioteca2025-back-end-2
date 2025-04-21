import { DataTypes } from "sequelize";
import banco from "../banco.js";

//mapeamento da model Editora
export default banco.define(
    'usuario',
    {
        // Model attributes are defined here
        idusuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        cpf:{
            type: DataTypes.STRING(15),
            allowNull: true
        },
        email:{
            type: DataTypes.STRING(100),
            allowNull: false
        },
        telefone    :{
            type: DataTypes.STRING(15),
            allowNull: true
        },
        nascimento: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        senha: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    }
);