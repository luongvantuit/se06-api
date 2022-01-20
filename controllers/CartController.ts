import { ObjectId } from "mongodb";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Log from "../middlewares/Log";
import Cart from "../models/Cart";
import Product from "../models/Product";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class CartController extends IController {

    private TAG: string = "CARTCONTROLLER"

    public async index(req: IRequest, res: IResponse) {
        Log.warn(`${this.TAG}: ${Date.toString()}`);
        await Token.verify(req, res, async (req, res, auth) => {
            const carts = await Cart.find({ uid: auth.uid });
            const response: any = {
                error: false,
                data: carts,
                msg: `success! get all information product in cart of user with uid: ${auth.uid}`,
                status: HttpStatusCode.OK,
                method: req.method,
                path: req.path
            }
            Log.default(response);
            await res.status(HttpStatusCode.OK).send(response);
        })
    }

    public async show(req: IRequest, res: IResponse) {
        Log.warn(`${this.TAG}: ${Date.toString()}`);
        const { cid } = await req.params;
        if (!ObjectId.isValid(cid)) {
            const response: any = {
                error: true,
                msg: `params wrong format with cid: ${cid}`,
                data: {
                    cid: cid,
                },
                status: HttpStatusCode.BAD_REQUEST,
                method: req.method,
                path: req.path,
            }
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const cart = await Cart.findOne({ _id: cid, uid: auth.uid });
                var response: any;
                if (!cart) {
                    response = {
                        error: true,
                        msg: `not found information product in cart with cid: ${cid}`,
                        data: {
                            cid: cid,
                        },
                        status: HttpStatusCode.NOT_FOUND,
                        method: req.method,
                        path: req.path,
                    }
                    await res.status(HttpStatusCode.NOT_FOUND);
                } else {
                    response = {
                        error: false,
                        data: cart,
                        msg: `success! get information product in cart with cid: ${cid}`,
                        status: HttpStatusCode.OK,
                        method: req.method,
                        path: req.path
                    }
                    await res.status(HttpStatusCode.OK);
                }
                Log.default(response);
                await res.send(response);
            });
        }
    }


    /**
     * 
     * @param req 
     * @param res 
     */
    public async create(req: IRequest, res: IResponse) {
        Log.warn(`${this.TAG}: ${Date.toString()}`);
        const { pid } = await req.params;
        const { quantily, classify } = await req.body;
        if (!ObjectId.isValid(pid)) {
            const response = {
                error: true,
                msg: `params wrong format with pid: ${pid}`,
                path: req.path,
                status: HttpStatusCode.BAD_REQUEST,
                method: req.method,
                data: {
                    pid: pid,
                },
            };
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        } else if (!quantily || !classify) {
            const response: any = {
                error: true,
                msg: `body property is empty`,
                path: req.path,
                status: HttpStatusCode.BAD_REQUEST,
                method: req.method,
                data: {
                    quantily: quantily,
                    classify: classify
                },
            };
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        } else if (typeof quantily !== 'number' || typeof classify !== 'number') {
            const response = {
                error: true,
                msg: `body wrong format with quantily: ${quantily}, classify: ${classify}`,
                path: req.path,
                status: HttpStatusCode.BAD_REQUEST,
                method: req.method,
                data: {
                    quantily: quantily,
                    classify: classify,
                },
            };
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const product = await Product.findOne({ _id: pid });
                if (!product) {
                    const response = {
                        error: true,
                        msg: `not found product with pid: ${pid}`,
                        status: HttpStatusCode.NOT_FOUND,
                        path: req.path,
                        method: req.method,
                        data: {
                            pid: pid
                        }
                    };
                    Log.default(response);
                    await res.status(HttpStatusCode.NOT_FOUND).send(response);
                } else {
                    const productInCart = await Cart.findOne({ classify: classify, pid: pid });
                    if (productInCart) {
                        const response: any = {
                            error: true,
                            msg: `product can existed in cart, method required is PUT`,
                            path: req.path,
                            status: HttpStatusCode.BAD_REQUEST,
                            method: req.method,
                            data: {
                                quantily: quantily,
                                classify: classify,
                                pid: pid,
                            },
                        }
                        Log.default(response);
                        await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                    } else if (classify > product.classifies.length) {
                        const response: any = {
                            error: true,
                            msg: `not found product with classfiy`,
                            status: HttpStatusCode.NOT_FOUND,
                            path: req.path,
                            method: req.method,
                            data: {
                                pid: pid,
                                classify: classify
                            }
                        };
                        Log.default(response);
                        await res.status(HttpStatusCode.NOT_FOUND).send(response);
                    } else if (quantily > product.classifies[classify].quantily) {
                        const response: any = {
                            error: true,
                            msg: `product quantity is not enough`,
                            status: HttpStatusCode.BAD_REQUEST,
                            path: req.path,
                            method: req.method,
                            data: {
                                pid: pid,
                                quantily: quantily,
                                quantilyCurrency: product.classifies[classify].quantily,
                            }
                        };
                        Log.default(response);
                        await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                    } else {
                        const cart = new Cart({
                            uid: auth.uid,
                            quantily: quantily,
                            classify: classify,
                            pid: pid,
                            date: Date.now()
                        })
                        const error = await cart.validateSync();
                        if (!error) {
                            const response: any = {
                                error: true,
                                msg: `body wrong format with quantily: ${quantily}, classify: ${classify}`,
                                path: req.path,
                                status: HttpStatusCode.BAD_REQUEST,
                                method: req.method,
                                data: {
                                    quantily: quantily,
                                    classify: classify,
                                },
                            };
                            Log.default(response);
                            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                        } else {
                            await cart.save();
                            const resCart = await Cart.find({ uid: auth.uid });
                            const response: any = {
                                error: true,
                                msg: `success! add product with pid: ${pid} to cart`,
                                path: req.path,
                                status: HttpStatusCode.OK,
                                method: req.method,
                                data: resCart,
                            };
                            Log.default(response);
                            await res.status(HttpStatusCode.OK).send(response);
                        }
                    }
                }
            });
        }
    }


    /**
     * Cannot verify classify of product
     * @param req 
     * @param res 
     */
    public async update(req: IRequest, res: IResponse) {
        const { cid } = await req.params;
        const { quantily, classify } = await req.body;
        if (!ObjectId.isValid(cid)) {
            const response: any = {
                error: true,
                msg: `params wrong format with cid: ${cid}`,
                path: req.path,
                status: HttpStatusCode.BAD_REQUEST,
                method: req.method,
                data: {
                    cid: cid,
                },
            };
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        } else if (!quantily || !classify) {
            const response: any = {
                error: true,
                msg: `body property is empty`,
                path: req.path,
                status: HttpStatusCode.BAD_REQUEST,
                method: req.method,
                data: {
                    quantily: quantily,
                    classify: classify
                },
            };
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        } else if (typeof quantily !== 'number' || typeof classify !== 'number') {
            const response: any = {
                error: true,
                msg: `body wrong format with quantily: ${quantily}, classify: ${classify}`,
                path: req.path,
                status: HttpStatusCode.BAD_REQUEST,
                method: req.method,
                data: {
                    quantily: quantily,
                    classify: classify
                },
            };
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const cart = await Cart.findOne({ _id: cid, classify: classify });
                if (!cart || cart.uid !== auth.uid) {
                    const response: any = {
                        error: true,
                        msg: `not found information product in cart with cid: ${cid}`,
                        path: req.path,
                        status: HttpStatusCode.NOT_FOUND,
                        method: req.method,
                        data: {
                            cid: cid,
                        },
                    };
                    Log.default(response);
                    await res.status(HttpStatusCode.NOT_FOUND).send(response);
                } else {
                    const product = await Product.findOne({ _id: cart.pid });
                    if (!product) {
                        const oldCart = await cart.delete();
                        const response: any = {
                            error: true,
                            msg: `not found information product, product was removed your cart`,
                            path: req.path,
                            status: HttpStatusCode.BAD_REQUEST,
                            method: req.method,
                            data: oldCart,
                        };
                        Log.default(response);
                        await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                    } else {
                        if (classify > product.classifies.length) {
                            const response: any = {
                                error: true,
                                msg: `not found classfiy of product with pid: ${cart.pid}`,
                                status: HttpStatusCode.BAD_REQUEST,
                                path: req.path,
                                method: req.method,
                                data: {
                                    classify: classify
                                }
                            };
                            Log.default(response);
                            await res.status(HttpStatusCode.NOT_FOUND).send(response);
                        } else if (quantily > product.classifies[classify].quantily && product.classifies[classify].quantily >= cart.quantily) {
                            const response: any = {
                                error: true,
                                msg: `product quantity is not enough`,
                                status: HttpStatusCode.BAD_REQUEST,
                                path: req.path,
                                method: req.method,
                                data: {
                                    classify: classify
                                }
                            };
                            Log.default(response);
                            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                        } else if (cart.quantily > product.classifies[classify].quantily) {

                        }
                    }
                }
            });
        }
    }

    /**
     * 
     * @param req 
     * @param res 
     */
    public async destroy(req: IRequest, res: IResponse) {
        Log.warn(`${this.TAG}: ${Date.toString()}`);
        const { cid } = await req.params;
        await Token.verify(req, res, async (req, res, auth) => {
            if (!ObjectId.isValid(cid)) {
                const response: any = {
                    error: true,
                    msg: `params wrong format with cid: ${cid}`,
                    path: req.path,
                    status: HttpStatusCode.BAD_REQUEST,
                    method: req.method,
                    data: {
                        cid: cid,
                    }
                };
                Log.default(response);
                await res.status(HttpStatusCode.BAD_REQUEST).send(response);
            } else {
                const cart = await Cart.findOne({ _id: cid });
                if (!cart || auth.uid !== cart.uid) {
                    const response: any = {
                        error: true,
                        msg: `can't found information product in cart with cid: ${cid}`,
                        path: req.path,
                        status: HttpStatusCode.BAD_REQUEST,
                        method: req.method,
                        data: {
                            cid: cid
                        }
                    };
                    Log.default(response)
                    await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                } else {
                    const old = await cart.delete();
                    const response: any = {
                        error: false,
                        data: old,
                        status: HttpStatusCode.OK,
                        msg: `success! delete product in cart with cid: ${cid}`,
                        path: req.path,
                        method: req.method,
                    };
                    Log.default(response);
                    await res.status(HttpStatusCode.OK).send(response);
                }
            }
        });
    }
}



export default new CartController;