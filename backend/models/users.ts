import { Model, DataTypes } from "sequelize";
import sequelize from "../utils/db";

class User extends Model {
  declare fullname: string;
  declare username: string;
  declare password: string;
  declare email: string;
  declare phone: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 50],
      },
    },

      fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 100],
      },
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: [4, 15],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 50],
      },
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
  }
);


export default User;