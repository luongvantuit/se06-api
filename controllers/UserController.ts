import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IBaseResponse from "../interfaces/vendors/IBaseResponse";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import User, { IUser } from "../models/User";
import CodeResponse from "../perform/CodeResponse";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class UserController extends IController {
    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        return await Token.verify(req, res, async (req, res, auth) => {
            const user = User.findOne({ uid: auth.uid })
            if (user === null)
                return res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        error: true,
                        code: CodeResponse.USER_INFORMATION_EMPTY,
                    }).end();
            return await res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    data: user,
                }).end();
        });
    }

    public async show(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { uid } = req.params;

        if (uid === undefined)
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    error: true,
                    code: CodeResponse.PARAM_EMPTY,
                })
                .end();

        const user = await User.findOne({
            uid: uid
        })
        if (user !== null) {
            const resUser: IUser = {
                uid: uid,
                displayName: user.displayName,
                address: user.address,
                displayPhoto: user.displayPhoto ?? `https://gravatar.com/avatar/${uid}?s=400&d=identicon`,
                bio: user.bio,
                birthday: user.birthday,
                email: user.email,
            }
            return res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    data: resUser,
                }).end();
        }
        return res.status(HttpStatusCode.BAD_REQUEST)
            .send({
                error: true,
                code: CodeResponse.USER_INFORMATION_EMPTY,
            }).end();
    }


    public async create(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): Promise<void> {
        return await Token.verify(req, res, (req, res, auth) => {

        })
    }


    public async update(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): Promise<void> {
        return await Token.verify(req, res, (req, res, auth) => {

        })
    }

}

export default new UserController;

