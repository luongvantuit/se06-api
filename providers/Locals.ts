import dotenv from "dotenv";
import { Application } from "express";
import Log from "../middlewares/Log";

class Locals {
    public config() {
        dotenv.config();

        var port: number;
        try {
            port = parseInt(process.env.PORT ?? "8080");
        } catch (error) {
            Log.default(error);
            port = 8080;
        }

        var isCORSEnable: boolean;
        try {
            isCORSEnable = Boolean(process.env.CORS_ENABLE ?? "fasle");
        } catch (error) {
            Log.default(error);
            isCORSEnable = false;
        }

        const URL: string = process.env.APP_URL ?? `http://localhost:${port}`;
        const mongodbURL: string = process.env.MONGODB_URL ?? 'mongodb://localhost:27017/data'
        const APIPrefix: string = process.env.API_PREFIX ?? 'api';

        return {
            port,
            isCORSEnable,
            URL,
            mongodbURL,
            APIPrefix,
        };
    }

    public initialization(_express: Application): Application {
        _express.locals.app = this.config();
        return _express;
    }
}

export default new Locals;
