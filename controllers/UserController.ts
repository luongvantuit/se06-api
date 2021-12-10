import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IBaseResponse from "../interfaces/vendors/IBaseResponse";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import User from "../models/User";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class UserController extends IController {
    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        return await Token.verify(req, res, async (req, res, auth) => {
            const user = User.findOne({ uid: auth.uid })
            return await res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    data: user,
                }).end();
        });
    }

    public show(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): void {

    }

}

export default new UserController;

