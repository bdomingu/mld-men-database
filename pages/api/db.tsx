import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: process.env.NEXT_PUBLIC_DATABASE,
  username: process.env.NEXT_PUBLIC_USER,
  password: process.env.NEXT_PUBLIC_PASSWORD,
  host: process.env.NEXT_PUBLIC_HOST,
  port: 3306, 
  dialect: 'mysql',
});

export default sequelize;