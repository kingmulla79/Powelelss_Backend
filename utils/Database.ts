require("dotenv").config();
import mongoose from "mongoose";

const dbURI: string = process.env.DBURI || "";

const connectDatabase = async () => {
  try {
    await mongoose.connect(dbURI).then((data: any) => {
      console.log(`Database connected. ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDatabase, 5000);
  }
};

export default connectDatabase;
