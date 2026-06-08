import { configDotenv } from "dotenv";
import mongoose from "mongoose";


configDotenv();
const dbconnect = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const connection = mongoose.connection;
        connection.on("connection", () => {
            console.log("Successfully connected to Mongodb");
        });
        connection.on("error", (error) => {
            console.log("Failed to establish the connection with db" + error);
            process.exit(1);
        });

    } catch (error) {
        console.log(
            "Failed to connect DB:",
            error
        );

        process.exit(1);

    }
}

export default dbconnect;