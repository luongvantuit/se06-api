import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Token from "../perform/Token";
import Shop from '../models/Shop';
import HttpStatusCode from "../perform/HttpStatusCode";
import { ObjectId } from "mongodb";
import CodeResponse from "../perform/CodeResponse";

class ShopController extends IController {
    public async index(req: IRequest, res: IResponse) {
        await Token.verify(req, res, async (req, res, auth) => {
            const shops = await Shop.find({ uid: auth.uid });
            res.status(HttpStatusCode.OK).send({
                error: false,
                data: shops,
            });
        });
    }

    public async show(req: IRequest, res: IResponse) {
        const { sid } = await req.params;
        if (!ObjectId.isValid(sid)) {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                code: CodeResponse.PARAM_WRONG_FORMAT,
                error: true,
            });
        } else {
            const shop = await Shop.findById(sid);
            if (!shop) {
                await res.status(HttpStatusCode.BAD_REQUEST).send({
                    error: true,
                    code: CodeResponse.SHOP_NOT_FOUND,
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
                    code: CodeResponse.BODY_PROPERTY_WRONG_FORMAT,
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
                    code: CodeResponse.PARAM_WRONG_FORMAT,
                    error: true,
                });
            } else {
                const oldShop = await Shop.findById(sid)
                if (!oldShop || oldShop.uid !== auth.uid) {
                    await res.status(HttpStatusCode.BAD_REQUEST).send({
                        error: true,
                        code: CodeResponse.SHOP_NOT_FOUND,
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
                            code: CodeResponse.BODY_PROPERTY_WRONG_FORMAT,
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
                code: CodeResponse.PARAM_WRONG_FORMAT,
                error: true,
            });
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const shop = await Shop.findById(sid);
                if (!shop || shop.uid !== auth.uid) {
                    await res.status(HttpStatusCode.BAD_REQUEST).send({
                        error: true,
                        code: CodeResponse.SHOP_NOT_FOUND,
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