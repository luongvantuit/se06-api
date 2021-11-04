import { Application } from "express";
import API from "../routes/API";
import Web from "../routes/Web";

class Routers {
    public mountAPI(express: Application): Application {
        return express.use('/api', API)
    }

    public mountWeb(express: Application): Application {
        return express.use('/', Web)
    }
}

export default new Routers;