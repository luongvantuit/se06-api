import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IBaseResponse from "../interfaces/vendors/IBaseResponse";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Token from "../perform/Token";
import Shop from '../models/Shop';
import HttpStatusCode from "../perform/HttpStatusCode";
import { ObjectId } from "mongodb";
import CodeResponse from "../perform/CodeResponse";

class ShopController extends IController {
    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        return await Token.verify(req, res, async (req, res, auth) => {
            const shops = await Shop.find({ uid: auth.uid });
            return res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    data: shops,
                })
                .end();
        });
    }

    public async show(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { sid } = await req.params;

        if (!ObjectId.isValid(sid))
            return await res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    code: CodeResponse.PARAM_WRONG_FORMAT,
                    error: true,
                })
                .end();
        const shop = await Shop.findById(sid);
        if (shop === null)
            return await res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    error: true,
                    code: CodeResponse.SHOP_NOT_FOUND,
                })
                .end();
        const resBody: any = {
            created: shop.created,
            description: shop.description,
            displayName: shop.displayName,
            displayPhoto: shop.displayPhoto,
            displayPhotoCover: shop.displayPhotoCover,
        }
        return await res.status(HttpStatusCode.OK)
            .send({
                error: false,
                data: resBody,
            })
            .end();
    }

    public async create(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const {
            description,
            displayName,
            displayPhoto,
            displayPhotoCover,
        } = await req.body;
        return await Token.verify(req, res, async (req, res, auth) => {
            const newShop = new Shop({
                created: Date.now(),
                uid: auth.uid,
                description: description,
                displayName: displayName,
                displayPhoto: displayPhoto,
                displayPhotoCover: displayPhotoCover,
            })
            const shop = await newShop.save();
            return await res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    data: shop,
                })
                .end();
        })
    }

    public async update(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): Promise<void> {
        const { sid } = await req.body;
        const {
            description,
            displayName,
            displayPhoto,
            displayPhotoCover,
        } = await req.body;
        return await Token.verify(req, res, async (req, res, auth) => {
            if (!ObjectId.isValid(sid))
                return await res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        code: CodeResponse.PARAM_WRONG_FORMAT,
                        error: true,
                    })
                    .end();
            const oldShop = await Shop.findById(sid)
            if (oldShop === null || oldShop.uid === auth.uid)
                return await res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        error: true,
                        code: CodeResponse.SHOP_NOT_FOUND,
                    })
                    .end();
            oldShop.description = description ?? oldShop.description;
            oldShop.displayName = displayName ?? oldShop.displayName;
            oldShop.displayPhoto = displayPhoto ?? oldShop.displayPhoto;
            oldShop.displayPhotoCover = displayPhotoCover ?? oldShop.displayPhotoCover;
            const newShop = await oldShop.save();
            return await res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    data: newShop,
                })
                .end();
        })
    }

    public async destroy(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<IBaseResponse<any>, Record<string, any>>): Promise<void> {
        const { sid } = await req.params;
        if (!ObjectId.isValid(sid))
            return await res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    code: CodeResponse.PARAM_WRONG_FORMAT,
                    error: true,
                })
                .end();
        return await Token.verify(req, res, async (req, res, auth) => {
            const shop = await Shop.findById(sid);
            if (shop === null || shop.uid === auth.uid)
                return await res.status(HttpStatusCode.BAD_REQUEST)
                    .send({
                        error: true,
                        code: CodeResponse.SHOP_NOT_FOUND,
                    })
                    .end();
            const oldShop = await shop.delete();
            return await res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    error: false,
                    data: oldShop,
                })
                .end();
        })
    }

}


export default new ShopController;