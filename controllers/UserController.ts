import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Log from "../middlewares/Log";
import User, { IUser } from "../models/User";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class UserController extends IController {
    public async index(req: IRequest, res: IResponse) {
        await Token.verify(req, res, async (req, res, auth) => {
            const user = await User.findOne({ uid: auth.uid })
            if (!user) {
                const response: any = {
                    error: true,
                    status: HttpStatusCode.BAD_REQUEST,
                    path: req.path,
                    method: req.method,
                    msg: `not found information user with uid: ${auth.uid}`,
                    data: {}
                };
                Log.default(response);
                await res.status(HttpStatusCode.BAD_REQUEST).send(response);
            } else {
                const response: any = {
                    error: false,
                    data: user,
                    status: HttpStatusCode.OK,
                    path: req.path,
                    method: req.method,
                    msg: 'success!'
                };
                Log.default(response);
                await res.status(HttpStatusCode.OK).send(response);
            }
        });
    }

    public async show(req: IRequest, res: IResponse) {
        const { uid } = await req.params;
        const user = await User.findOne({
            uid: uid
        });
        if (user) {
            const resUser: { _id: string } & IUser = {
                _id: user._id.toString(),
                uid: uid,
                displayName: user.displayName,
                address: user.address,
                displayPhoto: user.displayPhoto ?? `https://gravatar.com/avatar/${uid}?s=400&d=identicon`,
                displayPhotoCover: user.displayPhotoCover,
                bio: user.bio,
                birthday: user.birthday,
                email: user.email,
            };
            const response: any = {
                error: false,
                data: resUser,
                method: req.method,
                path: req.path,
                status: HttpStatusCode.OK,
                msg: 'success!',
            };
            Log.default(response);
            await res.status(HttpStatusCode.OK).send(response);
        } else {
            const response: any = {
                error: true,
                data: {
                    uid: uid
                },
                status: HttpStatusCode.NOT_FOUND,
                method: req.method,
                path: req.path,
                msg: `not found information of user with uid: ${uid}`
            };
            Log.default(response);
            await res.status(HttpStatusCode.NOT_FOUND).send(response);
        }
    }


    public async create(req: IRequest, res: IResponse) {
        await Token.verify(req, res, async (req, res, auth) => {
            const oldUser = await User.findOne({ uid: auth.uid });
            if (oldUser) {
                const response: any = {
                    error: true,
                    status: HttpStatusCode.METHOD_NOT_ALLOWED,
                    path: req.path,
                    method: req.method,
                    data: {
                        uid: auth.uid,
                    },
                    msg: `record of user with uid: ${auth.uid} existed`
                };
                Log.default(response);
                await res.status(HttpStatusCode.METHOD_NOT_ALLOWED).send(response);
            } else {
                const {
                    address,
                    displayName,
                    displayPhoto,
                    displayPhotoCover,
                    birthday,
                    bio,
                } = await req.body;
                const newUser = new User({
                    uid: auth.uid,
                    address: address,
                    displayName: displayName,
                    displayPhoto: displayPhoto ?? `https://gravatar.com/avatar/${auth.uid}?s=400&d=identicon`,
                    displayPhotoCover: displayPhotoCover,
                    birthday: birthday,
                    bio: bio,
                    email: auth.email,
                });
                const error = await newUser.validateSync();
                if (!error) {
                    const resBody = await newUser.save();
                    const response: any = {
                        error: false,
                        data: resBody,
                        status: HttpStatusCode.OK,
                        path: req.path,
                        method: req.method,
                        msg: 'success!'
                    }
                    Log.default(response)
                    await res.status(HttpStatusCode.OK).send(response);
                } else {
                    const response: any = {
                        error: true,
                        data: {
                            address: address,
                            displayName: displayName,
                            displayPhoto: displayPhoto,
                            displayPhotoCover: displayPhotoCover,
                            birthday: birthday,
                            bio: bio,
                            error: error
                        },
                        method: req.method,
                        path: req.path,
                        msg: 'body format wrong',
                        status: HttpStatusCode.BAD_REQUEST,
                    };
                    Log.default(response);
                    await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                }
            }
        });
    }

    public async update(req: IRequest, res: IResponse) {
        await Token.verify(req, res, async (req, res, auth) => {
            const oldUser = await User.findOne({ uid: auth.uid });
            if (!oldUser) {
                const response: any = {
                    error: true,
                    status: HttpStatusCode.METHOD_NOT_ALLOWED,
                    data: {
                        uid: auth.uid,
                    },
                    msg: `record of information user with uid: ${auth.uid} is not existed`,
                    path: req.path,
                    method: req.method
                };
                Log.default(response);
                await res.status(HttpStatusCode.METHOD_NOT_ALLOWED).send(response);
            } else {
                const {
                    address,
                    displayName,
                    displayPhoto,
                    displayPhotoCover,
                    birthday,
                    bio,
                } = await req.body;
                oldUser.address = address ?? oldUser.address;
                oldUser.displayPhoto = displayPhoto ?? `https://gravatar.com/avatar/${auth.uid}?s=400&d=identicon`;
                oldUser.displayName = displayName ?? oldUser.displayName;
                oldUser.birthday = birthday ?? oldUser.birthday;
                oldUser.displayPhotoCover = displayPhotoCover ?? oldUser.displayPhotoCover;
                oldUser.bio = bio ?? oldUser.bio;
                oldUser.email = auth.email;
                const error = await oldUser.validateSync();
                if (error) {
                    const response: any = {
                        error: true,
                        data: {
                            address: address,
                            displayName: displayName,
                            displayPhoto: displayPhoto,
                            displayPhotoCover: displayPhotoCover,
                            birthday: birthday,
                            bio: bio,
                            error: error
                        },
                        status: HttpStatusCode.BAD_REQUEST,
                        path: req.path,
                        method: req.method,
                        msg: `body format wrong`
                    };
                    Log.default(response);
                    await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                } else {
                    const newUser = await oldUser.save();
                    const response: any = {
                        error: false,
                        data: newUser,
                        method: req.method,
                        path: req.path,
                        msg: 'success!',
                        status: HttpStatusCode.OK,
                    }
                    Log.default(response);
                    await res.status(HttpStatusCode.OK).send(response);
                }
            }
        })
    }

}

export default new UserController;

