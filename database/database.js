import mongoose from "mongoose";
import { print, OutPutType } from "../helpers/print.js";

async function connect() {
    try {
        let connection = await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10
        });
        print("Connected to database", OutPutType.SUCCESS);
    } catch (error) {
        const { code, message } = error;
        if (code == 8000) {
            print("Error connecting to database", OutPutType.ERROR);
        }
        print(`Error connecting to database: ${message}`, OutPutType.ERROR);
    }
}

export default connect;