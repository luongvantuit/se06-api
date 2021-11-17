import { Application } from "express";
import API from "../routes/API";
import Web from "../routes/Web";
import Locals from "./Locals";
import { join } from 'path'

class Routers {

    public mountAPI(_express: Application): Application {
        return _express.use(join("/", Locals.config().APIPrefix), API);
    }

    public mountWeb(_express: Application): Application {
        return _express.use("/", Web);
    }
}

export default new Routers;
