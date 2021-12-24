import { Application } from "express";
import * as express from "express";
import * as path from "path";
class Statics {
    public mount(_express: Application): Application {
        _express = _express.use(
            "/static",
            express.static(path.join(__dirname, "../resources/static"))
        );
        _express = _express.use(
            "/public",
            express.static(path.join(__dirname, "../resources/public"))
        );
        _express = _express.use(
            "/upload",
            express.static(path.join(__dirname, "../upload"))
        );
        return _express;
    }
}

export default new Statics;
