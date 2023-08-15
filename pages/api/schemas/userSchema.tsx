import { DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../db';

class User extends Model {
  public id!: string; 
  public name!: string; 
  public email!: string;
  public password!: string; 
  public admin!: boolean;

}

User.init(
  {
    id: {
      type: DataTypes.UUID, 
      defaultValue: () => uuidv4(), 
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
        type: DataTypes.STRING, // Set the data type for the 'password' field
        allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

export default User;
