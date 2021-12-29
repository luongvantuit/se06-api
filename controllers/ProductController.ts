import { ParamsDictionary } from "express-serve-static-core";
import { ObjectId } from "mongodb";
import { ParsedQs } from "qs";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Product, { Classify } from "../models/Product";
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
        const {
            description,
            displayName,
            photos,
            address,
            classifies,
            categories,
        } = await req.body;

        if ((description !== undefined && typeof description !== 'string')
            || (displayName !== undefined && typeof displayName !== 'string')
            || (address !== undefined && typeof address !== 'string')
            || (categories !== undefined && (!Array.isArray(categories) || !this.verifyCategories(categories)))
            || (classifies !== undefined && (!Array.isArray(classifies) || !this.verifyClassifies(classifies)))
            || (photos !== undefined && (!Array.isArray(photos) || !this.verifyPhotos(photos))))
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    error: true,
                    code: CodeResponse.BODY_PROPERTY_WRONG_FORMAT,
                })
                .end();

        if (!ObjectId.isValid(sid))
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

            const product = new Product({
                sid: sid,
                description: description,
                displayName: displayName,
                photos: photos,
                address: address,
                classifies: classifies,
                categories: categories,
            })

            const newProduct = await product.save();
            return res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    data: newProduct,
                })
                .end();
        });
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

    public async edit(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): Promise<void> {
        const { sid, pid } = await req.params;
        const {
            description,
            displayName,
            photos,
            address,
            classifies,
            categories,
        } = await req.body;

        if ((description !== undefined && typeof description !== 'string')
            || (displayName !== undefined && typeof displayName !== 'string')
            || (address !== undefined && typeof address !== 'string')
            || (categories !== undefined && (!Array.isArray(categories) || !this.verifyCategories(categories)))
            || (classifies !== undefined && (!Array.isArray(classifies) || !this.verifyClassifies(classifies)))
            || (photos !== undefined && (!Array.isArray(photos) || !this.verifyPhotos(photos))))
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    error: true,
                    code: CodeResponse.BODY_PROPERTY_WRONG_FORMAT,
                })
                .end();

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

            product.description = description ?? product.description;
            product.displayName = displayName ?? product.displayName;
            product.photos = photos ?? product.photos;
            product.address = address ?? product.address;
            product.classifies = classifies ?? product.classifies;
            product.categories = categories ?? product.categories;

            const newProduct = await product.save();
            return res.status(HttpStatusCode.OK)
                .send({
                    error: false,
                    data: newProduct,
                })
                .end();
        });
    }

    public async show(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): Promise<void> {
        const { pid } = await req.params;
        if (!ObjectId.isValid(pid))
            return res.status(HttpStatusCode.BAD_REQUEST)
                .send({
                    error: true,
                    code: CodeResponse.PARAM_WRONG_FORMAT,
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
        return res.status(HttpStatusCode.OK)
            .send({
                error: false,
                data: product
            })
            .end();
    }

    public verifyPhotos(photos: Array<any>): boolean {
        for (let index = 0; index < photos.length; index++) {
            try {
                new URL(photos[index])
            } catch (error: any) {
                return false
            }
        }
        return true;
    }

    public verifyClassifies(classifies: Array<any>): boolean {
        for (let index = 0; index < classifies.length; index++) {
            const classify: Classify = classifies[index];
            if (isNaN(classify.price)
                || (classify.displayName !== undefined && typeof classify.displayName !== 'string'))
                return false;
        }
        return true;
    }

    public verifyCategories(categories: Array<any>): boolean {
        for (let index = 0; index < categories.length; index++) {
            if (typeof categories[index] !== 'string')
                return false;
        }
        return true;
    }

}


export default new ProductController;