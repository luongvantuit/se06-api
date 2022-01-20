import { ObjectId } from "mongodb";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Cart from "../models/Cart";
import Product from "../models/Product";
import CodeResponse from "../perform/CodeResponse";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class CartController extends IController {
    public async index(req: IRequest, res: IResponse) {
        await Token.verify(req, res, async (req, res, auth) => {
            const carts = await Cart.findOne({ uid: auth.uid });
            await res.status(HttpStatusCode.OK).send({
                error: false,
                data: carts,
            });
        })
    }

    public async show(req: IRequest, res: IResponse) {
        const { cid } = await req.params;
        if (!ObjectId.isValid(cid)) {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                error: true,
                code: CodeResponse.PARAM_WRONG_FORMAT,
            });
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const cart = await Cart.findOne({ _id: cid, uid: auth.uid });
                if (!cart) {
                    await res.status(HttpStatusCode.NOT_FOUND).send({
                        error: true,
                        code: CodeResponse.PRODUCT_NOT_FOUND
                    });
                } else {
                    await res.status(HttpStatusCode.OK).send({
                        error: false,
                        data: cart,
                    });
                }
            });
        }
    }


    /**
     * 
     * @param req 
     * @param res 
     */
    public async create(req: IRequest, res: IResponse) {
        const { pid } = await req.params;
        const { quantily, classify } = await req.body;
        if (!ObjectId.isValid(pid)) {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                error: true,
                code: CodeResponse.PARAM_WRONG_FORMAT,
                msg: `params wrong format with pid: ${pid}`,
                path: req.path,
                status: HttpStatusCode.BAD_REQUEST,
                method: req.method,
                data: {
                    pid: pid,
                },
            });
        } else if (!quantily || !classify) {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                error: true,
                code: CodeResponse.BODY_PROPERTY_EMPTY,
                msg: `body property is empty`,
                path: req.path,
                status: HttpStatusCode.BAD_REQUEST,
                method: req.method,
                data: {
                    quantily: quantily,
                    classify: classify
                },
            });
        } else if (typeof quantily !== 'number' || typeof classify !== 'number') {
            await res.status(HttpStatusCode.BAD_REQUEST).send({
                error: true,
                code: CodeResponse.BODY_PROPERTY_WRONG_FORMAT,
                msg: `body wrong format with quantily: ${quantily}, classify: ${classify}`,
                path: req.path,
                status: HttpStatusCode.BAD_REQUEST,
                method: req.method,
                data: {
                    quantily: quantily,
                    classify: classify,
                },
            });
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const product = await Product.findOne({ _id: pid });
                if (!product) {
                    await res.status(HttpStatusCode.NOT_FOUND).send({
                        error: true,
                        code: CodeResponse.PRODUCT_NOT_FOUND,
                        msg: `not found product with pid: ${pid}`,
                        status: HttpStatusCode.NOT_FOUND,
                        path: req.path,
                        method: req.method,
                        data: {
                            pid: pid
                        }
                    });
                } else {
                    const productInCart = await Cart.findOne({ classify: classify, pid: pid });
                    if (productInCart) {
                        await res.status(HttpStatusCode.BAD_REQUEST).send({
                            error: true,
                            code: CodeResponse.METHOD_REQUEST_WRONG,
                            msg: `product can existed in cart, method required is PUT`,
                            path: req.path,
                            status: HttpStatusCode.BAD_REQUEST,
                            method: req.method,
                            data: {
                                quantily: quantily,
                                classify: classify,
                                pid: pid,
                            },
                        });
                    } else {
                        const cart = new Cart({
                            uid: auth.uid,
                            quantily: quantily,
                            classify: classify,
                            pid: pid
                        })
                        const error = await cart.validateSync();
                        if (!error) {
                            await res.status(HttpStatusCode.BAD_REQUEST).send({
                                error: true,
                                code: CodeResponse.BODY_PROPERTY_WRONG_FORMAT,
                                msg: `body wrong format with quantily: ${quantily}, classify: ${classify}`,
                                path: req.path,
                                status: HttpStatusCode.BAD_REQUEST,
                                method: req.method,
                                data: {
                                    quantily: quantily,
                                    classify: classify,
                                },
                            });
                        } else {
                            const resCart = await cart.save();
                            await res.status(HttpStatusCode.OK).send({
                                error: true,
                                msg: `success! add product with pid: ${pid} to cart`,
                                path: req.path,
                                status: HttpStatusCode.OK,
                                method: req.method,
                                data: resCart,
                            });
                        }
                    }
                }
            });
        }
    }

    public update(req: IRequest, res: IResponse) {

    }

    /**
     * 
     * @param req 
     * @param res 
     */
    public async destroy(req: IRequest, res: IResponse) {
        const { cid } = await req.params;
        await Token.verify(req, res, async (req, res, auth) => {
            if (!ObjectId.isValid(cid)) {
                await res.status(HttpStatusCode.BAD_REQUEST).send({
                    error: true,
                    code: CodeResponse.PARAM_WRONG_FORMAT
                });
            } else {
                const cart = await Cart.findOne({ _id: cid });
                if (!cart || auth.uid !== cart.uid) {
                    await res.status(HttpStatusCode.BAD_REQUEST).send({
                        error: true,
                        code: CodeResponse.PRODUCT_NOT_FOUND
                    });
                } else {
                    const old = await cart.delete();
                    await res.status(HttpStatusCode.OK).send({
                        error: false,
                        data: old
                    });
                }
            }
        });
    }
}



export default new CartController;