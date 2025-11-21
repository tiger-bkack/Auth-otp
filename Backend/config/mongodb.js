import mongooes, { model } from "mongoose";

const connectDB = async () => {
  mongooes.connection.on("connected", () => console.log("DataBase Connected"));
  await mongooes.connect(`${process.env.MONGODB_URL}/full-auth `);
};

export default connectDB;
