import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IBaseResponse from "../interfaces/vendors/IBaseResponse";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";

class UserController extends IController {
    public index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): void {

    }

}

export default new UserController;

