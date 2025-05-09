const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

const connectMongoDB = async () => {
  try {
    const mongoConn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${mongoConn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);  
  }
};

const dbHost = process.env.PG_HOST || 'localhost';
const dbUser = process.env.PG_USER || 'postgres';
const dbPassword = process.env.PG_PASSWORD || 'yehia';
const dbName = process.env.PG_DATABASE || 'circleConnect';
const dbPort = process.env.PG_PORT || '5432';

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
});

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected Successfully');
  } catch (error) {
    console.error('PostgreSQL Connection Error:', error);
    process.exit(1);  
  }
};

const connectDB = async () => {
  await connectMongoDB();
  await connectPostgres();
};

module.exports = {
  connectDB,
  sequelize,
};