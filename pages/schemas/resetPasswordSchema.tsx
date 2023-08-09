import { DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../api/db';

class ResetPassword extends Model {
  public id!: string; 
  public email!: string;
  public token!: string;
}

ResetPassword.init(
  {
    id: {
      type: DataTypes.UUID, 
      defaultValue: () => uuidv4(), 
      primaryKey: true,
    },
   
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    token: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'resetpassword',
    timestamps: true,
    underscored: true,
  }
);

export default ResetPassword;
