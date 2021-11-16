import { Request } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";

interface IRequest<
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = Query,
    Locals extends Record<string, any> = Record<string, any>
    > extends Request<P, ResBody, ReqBody, ReqQuery, Locals> { }

export default IRequest;
