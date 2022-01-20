import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import User, { IUser } from "../models/User";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class UserController extends IController {
    public async index(req: IRequest, res: IResponse) {
        await Token.verify(req, res, async (req, res, auth) => {
            const user = await User.findOne({ uid: auth.uid })
            if (!user) {
                await res.status(HttpStatusCode.BAD_REQUEST).send({
                    error: true,
                });
            } else {
                await res.status(HttpStatusCode.OK).send({
                    error: false,
                    data: user,
                });
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
            }
            await res.status(HttpStatusCode.OK).send({
                error: false,
                data: resUser,
            });
        } else {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                error: true,
            });
        }
    }


    public async create(req: IRequest, res: IResponse) {
        await Token.verify(req, res, async (req, res, auth) => {
            const oldUser = await User.findOne({ uid: auth.uid });
            if (oldUser) {
                await res.status(HttpStatusCode.BAD_REQUEST).send({
                    error: true,
                });
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
                    await res.status(HttpStatusCode.OK).send({
                        error: false,
                        data: resBody,
                    });
                } else {
                    await res.status(HttpStatusCode.BAD_REQUEST).send({
                        error: true,
                        data: error
                    });
                }
            }
        });
    }

    public async update(req: IRequest, res: IResponse) {
        await Token.verify(req, res, async (req, res, auth) => {
            const oldUser = await User.findOne({ uid: auth.uid });
            if (!oldUser) {
                await res.status(HttpStatusCode.BAD_REQUEST).send({
                    error: true,
                });
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
                    await res.status(HttpStatusCode.BAD_REQUEST).send({
                        error: true,
                        data: error
                    });
                } else {
                    const newUser = await oldUser.save();
                    await res.status(HttpStatusCode.OK).send({
                        error: false,
                        data: newUser,
                    });
                }
            }
        })
    }

}

export default new UserController;

