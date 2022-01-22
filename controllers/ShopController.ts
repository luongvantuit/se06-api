import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Token from "../perform/Token";
import Shop from '../models/Shop';
import HttpStatusCode from "../perform/HttpStatusCode";
import { ObjectId } from "mongodb";
import Log from "../middlewares/Log";

class ShopController extends IController {
    public async index(req: IRequest, res: IResponse) {
        const { uid } = await req.params;
        const { limit, page } = await req.query;
        const mLimit: number = Number(limit ?? 10);
        const mPage: number = Number(page ?? 0);
        const shops = await Shop.find({ uid: uid });
        const maxPage = Math.ceil(shops.length / mLimit);
        const responseShops: Array<any> = []
        for (let index: number = mLimit * mPage; index < shops.length; index++) {
            responseShops.push(shops[index])
        }
        const response: any = {
            error: false,
            data: responseShops,
            maxPage: maxPage,
            status: HttpStatusCode.OK,
            path: req.path,
            method: req.method,
            msg: `get all shop success! limit: ${limit},page: ${page}`
        };
        Log.default(response)
        await res.status(HttpStatusCode.OK).send(response);
    }

    public async show(req: IRequest, res: IResponse) {
        const { sid } = await req.params;
        if (!ObjectId.isValid(sid)) {
            const response: any = {
                error: true,
                status: HttpStatusCode.BAD_REQUEST,
                path: req.path,
                method: req.method,
                data: {
                    sid: sid
                },
                msg: `params format wrong! sid: ${sid}`
            };
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        } else {
            const shop = await Shop.findById(sid);
            if (!shop) {
                const response: any = {
                    error: true,
                    status: HttpStatusCode.NOT_FOUND,
                    path: req.path,
                    method: req.method,
                    data: {
                        sid: sid
                    },
                    msg: `not found shop with sid: ${sid}`
                };
                Log.default(response);
                await res.status(HttpStatusCode.NOT_FOUND).send(response);
            } else {
                const resBody: any = {
                    created: shop.created,
                    description: shop.description,
                    displayName: shop.displayName,
                    displayPhoto: shop.displayPhoto,
                    displayPhotoCover: shop.displayPhotoCover,
                }
                const response: any = {
                    error: false,
                    data: resBody,
                    status: HttpStatusCode.OK,
                    path: req.path,
                    method: req.method,
                    msg: `success! sid: ${sid}`
                };
                Log.default(response);
                await res.status(HttpStatusCode.OK).send(response);
            }
        }
    }

    public async create(req: IRequest, res: IResponse) {
        const {
            description,
            displayName,
            displayPhoto,
            displayPhotoCover,
        } = await req.body;
        await Token.verify(req, res, async (req, res, auth) => {
            const newShop = new Shop({
                created: Date.now(),
                uid: auth.uid,
                description: description,
                displayName: displayName,
                displayPhoto: displayPhoto,
                displayPhotoCover: displayPhotoCover,
            })
            const error = await newShop.validateSync();
            if (!error) {
                const shop = await newShop.save();
                const response: any = {
                    error: false,
                    data: shop,
                    status: HttpStatusCode.OK,
                    path: req.path,
                    method: req.method,
                    msg: `success! create new shop`
                };
                Log.default(response);
                await res.status(HttpStatusCode.OK).send(response);
            } else {
                const response: any = {
                    error: true,
                    data: {
                        error: error,
                        description: description,
                        displayName: displayName,
                        displayPhoto: displayPhoto,
                        displayPhotoCover: displayPhotoCover
                    },
                    status: HttpStatusCode.BAD_REQUEST,
                    path: req.path,
                    method: req.method,
                    msg: 'body format wrong!'
                };
                Log.default(response);
                await res.status(HttpStatusCode.BAD_REQUEST).send(response);
            }
        })
    }

    public async update(req: IRequest, res: IResponse) {
        const { sid } = await req.params;
        const {
            description,
            displayName,
            displayPhoto,
            displayPhotoCover,
        } = await req.body;
        await Token.verify(req, res, async (req, res, auth) => {
            if (!ObjectId.isValid(sid)) {
                const response: any = {
                    error: true,
                    status: HttpStatusCode.BAD_REQUEST,
                    path: req.path,
                    method: req.method,
                    data: {
                        sid: sid
                    },
                    msg: `param format wrong! sid: ${sid}`
                };
                Log.default(response);
                await res.status(HttpStatusCode.BAD_REQUEST).send(response);
            } else {
                const oldShop = await Shop.findById(sid)
                if (!oldShop || oldShop.uid !== auth.uid) {
                    const response: any = {
                        error: true,
                        status: HttpStatusCode.NOT_FOUND,
                        path: req.path,
                        method: req.method,
                        data: {
                            sid: sid
                        },
                        msg: `not found shop with sid: ${sid}`
                    };
                    Log.default(response);
                    await res.status(HttpStatusCode.NOT_FOUND).send(response);
                } else {
                    oldShop.description = description ?? oldShop.description;
                    oldShop.displayName = displayName ?? oldShop.displayName;
                    oldShop.displayPhoto = displayPhoto ?? oldShop.displayPhoto;
                    oldShop.displayPhotoCover = displayPhotoCover ?? oldShop.displayPhotoCover;
                    const error = await oldShop.validateSync();
                    if (!error) {
                        const newShop = await oldShop.save();
                        const response: any = {
                            error: false,
                            data: newShop,
                            status: HttpStatusCode.OK,
                            path: req.path,
                            method: req.method,
                            msg: `success! update information shop with sid: ${sid}`
                        }
                        Log.default(response);
                        await res.status(HttpStatusCode.OK).send(response);
                    } else {
                        const response: any = {
                            error: true,
                            data: {
                                error: error,
                                description: description,
                                displayName: displayName,
                                displayPhoto: displayPhoto,
                                displayPhotoCover: displayPhotoCover
                            },
                            status: HttpStatusCode.BAD_REQUEST,
                            path: req.path,
                            method: req.method,
                            msg: 'body format wrong!'
                        }
                        Log.default(response)
                        await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                    }
                }
            }
        })
    }

    public async destroy(req: IRequest, res: IResponse) {
        const { sid } = await req.params;
        if (!ObjectId.isValid(sid)) {
            const response: any = {
                error: true,
                status: HttpStatusCode.BAD_REQUEST,
                path: req.path,
                method: req.method,
                data: {
                    sid: sid
                },
                msg: `param format wrong! sid: ${sid}`
            };
            Log.default(response)
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const shop = await Shop.findById(sid);
                if (!shop || shop.uid !== auth.uid) {
                    const response: any = {
                        error: true,
                        status: HttpStatusCode.NOT_FOUND,
                        path: req.path,
                        method: req.method,
                        data: {
                            sid: sid
                        },
                        msg: `not found shop with sid: ${sid}`
                    };
                    Log.default(response);
                    await res.status(HttpStatusCode.NOT_FOUND).send(response);
                } else {
                    const oldShop = await shop.delete();
                    const response: any = {
                        error: false,
                        data: oldShop,
                        status: HttpStatusCode.OK,
                        path: req.path,
                        method: req.method,
                        msg: `delete success! sid: ${sid}`
                    }
                    Log.default(response);
                    await res.status(HttpStatusCode.OK).send(response);
                }
            })
        }
    }

}


export default new ShopController;