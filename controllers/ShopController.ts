import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Token from "../perform/Token";
import Shop from '../models/Shop';
import HttpStatusCode from "../perform/HttpStatusCode";
import { ObjectId } from "mongodb";

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
        res.status(HttpStatusCode.OK).send({
            error: false,
            data: responseShops,
            maxPage: maxPage,
        });
    }

    public async show(req: IRequest, res: IResponse) {
        const { sid } = await req.params;
        if (!ObjectId.isValid(sid)) {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                error: true,
            });
        } else {
            const shop = await Shop.findById(sid);
            if (!shop) {
                await res.status(HttpStatusCode.BAD_REQUEST).send({
                    error: true,
                });
            } else {
                const resBody: any = {
                    created: shop.created,
                    description: shop.description,
                    displayName: shop.displayName,
                    displayPhoto: shop.displayPhoto,
                    displayPhotoCover: shop.displayPhotoCover,
                }
                await res.status(HttpStatusCode.OK).send({
                    error: false,
                    data: resBody,
                });
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
                await res.status(HttpStatusCode.OK).send({
                    error: false,
                    data: shop,
                });
            } else {
                await res.status(HttpStatusCode.BAD_REQUEST).send({
                    error: true,
                    data: error,
                });
            }
        })
    }

    public async update(req: IRequest, res: IResponse) {
        const { sid } = await req.body;
        const {
            description,
            displayName,
            displayPhoto,
            displayPhotoCover,
        } = await req.body;
        await Token.verify(req, res, async (req, res, auth) => {
            if (!ObjectId.isValid(sid)) {
                await res.status(HttpStatusCode.BAD_REQUEST).send({
                    error: true,
                });
            } else {
                const oldShop = await Shop.findById(sid)
                if (!oldShop || oldShop.uid !== auth.uid) {
                    await res.status(HttpStatusCode.BAD_REQUEST).send({
                        error: true,
                    });
                } else {
                    oldShop.description = description ?? oldShop.description;
                    oldShop.displayName = displayName ?? oldShop.displayName;
                    oldShop.displayPhoto = displayPhoto ?? oldShop.displayPhoto;
                    oldShop.displayPhotoCover = displayPhotoCover ?? oldShop.displayPhotoCover;
                    const error = await oldShop.validateSync();
                    if (!error) {
                        const newShop = await oldShop.save();
                        await res.status(HttpStatusCode.OK).send({
                            error: false,
                            data: newShop,
                        });
                    } else {
                        await res.status(HttpStatusCode.BAD_REQUEST).send({
                            error: true,
                            data: error,
                        });
                    }
                }
            }
        })
    }

    public async destroy(req: IRequest, res: IResponse) {
        const { sid } = await req.params;
        if (!ObjectId.isValid(sid)) {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                error: true,
            });
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const shop = await Shop.findById(sid);
                if (!shop || shop.uid !== auth.uid) {
                    await res.status(HttpStatusCode.BAD_REQUEST).send({
                        error: true,
                    });
                } else {
                    const oldShop = await shop.delete();
                    await res.status(HttpStatusCode.BAD_REQUEST).send({
                        error: false,
                        data: oldShop,
                    });
                }
            })
        }
    }

}


export default new ShopController;