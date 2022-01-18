import { Application } from "express";
import API from "../routes/API";
import Locals from "./Locals";
import { join } from 'path'

class Routers {

    public mountAPI(_express: Application): Application {
        return _express.use(join("/", Locals.config().APIPrefix), API);
    }
}

export default new Routers;
