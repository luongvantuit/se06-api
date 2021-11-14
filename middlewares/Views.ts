import * as express from "express";
import * as path from "path";

class Views {
  /**
   *  Mount Engine View
   */
  public mount(_express: express.Application): express.Application {
    _express = _express.set("view engine", "ejs")
    _express = _express.set("views",path.join(__dirname, "../resources/views/"))
    return _express;
  }
}

export default new Views();
