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
            const user = await User.findOne({ uid: auth.uid })
            if (user === null)
                return await res.status(HttpStatusCode.BAD_REQUEST)
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
            return await res.status(HttpStatusCode.BAD_REQUEST)
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
                displayPhotoCover: user.displayPhotoCover,
                bio: user.bio,
                birthday: user.birthday,
                email: user.email,
            }
            return await res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    data: resUser,
                }).end();
        }
        return await res.status(HttpStatusCode.BAD_REQUEST)
            .send({
                error: true,
                code: CodeResponse.USER_INFORMATION_EMPTY,
            }).end();
    }


    public async create(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        return await Token.verify(req, res, async (req, res, auth) => {
            const oldUser = await User.findOne({ uid: auth.uid });
            if (oldUser !== null)
                return await res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        error: true,
                        code: CodeResponse.METHOD_REQUEST_WRONG,
                    })
                    .end();
            const {
                address,
                displayName,
                displayPhoto,
                displayPhotoCover,
                birthday,
                bio,
            } = req.body;
            try {
                const newUser = new User({
                    uid: auth.uid,
                    address: address,
                    displayName: displayName,
                    displayPhoto: displayPhoto ?? `https://gravatar.com/avatar/${auth.uid}?s=400&d=identicon`,
                    displayPhotoCover: displayPhotoCover,
                    birthday: birthday,
                    bio: bio,
                    email: auth.email,
                })
                const resBody = await newUser.save();
                return await res.status(HttpStatusCode.OK)
                    .send({
                        error: false,
                        data: resBody,
                    }).end();
            } catch (error: any) {
                return await res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        error: true,
                        code: CodeResponse.BODY_PROPERTY_WRONG_FORMAT,
                    }).end();
            }
        });
    }


    public async update(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        return await Token.verify(req, res, async (req, res, auth) => {
            const oldUser = await User.findOne({ uid: auth.uid });
            if (oldUser === null)
                return await res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        error: true,
                        code: CodeResponse.USER_INFORMATION_EMPTY,
                    })
                    .end();
            const {
                address,
                displayName,
                displayPhoto,
                displayPhotoCover,
                birthday,
                bio,
            } = req.body;
            try {
                oldUser.address = address ?? oldUser.address;
                oldUser.displayPhoto = displayPhoto ?? `https://gravatar.com/avatar/${auth.uid}?s=400&d=identicon`;
                oldUser.displayName = displayName ?? oldUser.displayName;
                oldUser.birthday = birthday ?? oldUser.birthday;
                oldUser.displayPhotoCover = displayPhotoCover ?? oldUser.displayPhotoCover;
                oldUser.bio = bio ?? oldUser.bio;
                oldUser.email = auth.email;
                const newUser = await oldUser.save();
                return await res.status(HttpStatusCode.OK)
                    .send({
                        error: false,
                        data: newUser,
                    }).end();
            } catch (error: any) {
                return await res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        error: true,
                        code: CodeResponse.BODY_PROPERTY_WRONG_FORMAT,
                    }).end();
            }
        })
    }

}

export default new UserController;

