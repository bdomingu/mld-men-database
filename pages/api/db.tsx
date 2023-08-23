import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: process.env.NEXT_PUBLIC_DATABASE,
  username: process.env.NEXT_PUBLIC_USER,
  password: process.env.NEXT_PUBLIC_PASSWORD,
  host: process.env.NEXT_PUBLIC_HOST === 'localhost' ? "http://localhost:3000" : `/cloudsql/${process.env.NEXT_PUBLIC_HOST}`,
  port: 3306, 
  dialect: 'mysql',
  dialectOptions: {
    socketPath: `/cloudsql/${process.env.NEXT_PUBLIC_HOST}`
},
});

export default sequelize;

