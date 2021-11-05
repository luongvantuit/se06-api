import { Application } from "express";


class CORS {
    public mount(_express: Application): Application {
        return _express;
    }
}

export default new CORS;