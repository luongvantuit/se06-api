import * as express from "express";
import * as path from "path";

class Views {
  /**
   *  Mount Engine View
   */
  public mount(_express: express.Application): express.Application {
    return _express;
  }
}

export default new Views();
