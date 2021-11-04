import dotenv from 'dotenv'
import { Application } from 'express';
import Log from '../middlewares/Log';

class Locals {

    public config() {
        dotenv.config();



        var port: number;
        try {
            port = parseInt(process.env.PORT ?? '8080');
        } catch (error) {
            Log.default(error);
            port = 8080;
        }





        return {
            port,
        };
    }

    public initialization(express: Application): Application {
        express.locals.app = this.config();
        return express;
    }

}

export default new Locals;