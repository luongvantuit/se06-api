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
    return _express;
  }
}

export default new Statics();
