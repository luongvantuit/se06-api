import { ParamsDictionary } from "express-serve-static-core";
import { ObjectId } from "mongodb";
import { ParsedQs } from "qs";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Product from "../models/Product";
import Shop from "../models/Shop";
import CodeResponse from "../perform/CodeResponse";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class ProductController extends IController {

    public async index(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): Promise<void> {
        const {
            sid,
            limit,
            page,
            category
        } = await req.params;
        if (sid === undefined) {

        }
        else {

        }
    }

    public async create(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): Promise<void> {
        const { sid } = await req.params;
    }

    public async destroy(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): Promise<void> {
        const { sid, pid } = await req.params;

        if (!ObjectId.isValid(sid) || !ObjectId.isValid(pid))
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    error: true,
                    code: CodeResponse.PARAM_WRONG_FORMAT,
                })
                .end();

        return Token.verify(req, res, async (req, res, auth) => {
            const shop = await Shop.findById(sid);
            if (shop === null || shop.uid !== auth.uid)
                return res.status(HttpStatusCode.NOT_FOUND)
                    .send({
                        error: true,
                        code: CodeResponse.SHOP_NOT_FOUND,
                    })
                    .end();
            const product = await Product.findById(pid);
            if (product === null)
                return res.status(HttpStatusCode.NOT_FOUND)
                    .send({
                        error: true,
                        code: CodeResponse.PRODUCT_NOT_FOUND,
                    })
                    .end();

            const oldProduct = await product.delete();
            return res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    data: oldProduct,
                })
                .end();
        });
    }

    public edit(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): void {

    }

    public show(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): void {

    }

}


export default new ProductController;