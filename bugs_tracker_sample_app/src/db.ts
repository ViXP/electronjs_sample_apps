import { connect } from "mongoose";

const CONNECTION_ADDRESS = process.env.MONGODB_URL

export const connectDb = async () => {
  try {
    await connect(CONNECTION_ADDRESS, {
      dbName: "buglogger"
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDb
