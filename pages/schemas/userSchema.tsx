import { DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../api/db';

class User extends Model {
  public id!: string; 
  public name!: string; 
  public email!: string;
  public password!: string; 

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
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

export default User;
