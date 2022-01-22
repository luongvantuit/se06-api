import { ObjectId } from "mongodb";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Log from "../middlewares/Log";
import Classify from "../models/Classify";
import Product from "../models/Product";
import Shop from "../models/Shop";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";

class ClassifyController extends IController {

    public async index(req: IRequest, res: IResponse) {
        const { pid } = await req.params;
        const classifies = await Classify.find({ pid: pid, deleted: false });
        const response = {
            error: false,
            status: HttpStatusCode.OK,
            path: req.path,
            method: req.method,
            data: classifies,
            msg: `get all classifies of product with pid: ${pid} success!`
        }
        Log.default(response);
        await res.status(HttpStatusCode.OK).send(response);
    }



    public async show(req: IRequest, res: IResponse) {
        const { cid } = await req.params;
        if (ObjectId.isValid(cid)) {
            const classify = await Classify.findOne({ _id: cid, deleted: false });
            if (classify) {
                const response = {
                    error: false,
                    status: HttpStatusCode.OK,
                    path: req.path,
                    method: req.method,
                    data: classify,
                    msg: `get success information of classify id: ${cid}`
                };
                Log.default(response);
                res.status(HttpStatusCode.OK).send(response);
            } else {
                const response = {
                    error: true,
                    status: HttpStatusCode.NOT_FOUND,
                    path: req.path,
                    method: req.method,
                    data: {
                        cid: cid
                    },
                    msg: `not found information of classify id: ${cid}`
                };
                Log.default(response);
                res.status(HttpStatusCode.OK).send(response);
            }
        } else {
            const response = {
                error: true,
                status: HttpStatusCode.BAD_REQUEST,
                path: req.path,
                method: req.method,
                data: {
                    cid: cid
                },
                msg: `param format wrong! with cid: ${cid}`
            }
            Log.default(response);
            await res.status(HttpStatusCode.OK).send(response);
        }
    }



    public async create(req: IRequest, res: IResponse) {
        const { pid } = await req.params;
        if (ObjectId.isValid(pid)) {
            await Token.verify(req, res, async (req, res, auth) => {
                const product = await Product.findOne({ _id: pid, deleted: false });
                if (product) {
                    const shop = await Shop.findOne({ _id: product.sid, deleted: false });
                    if (!shop || shop.uid !== auth.uid) {
                        const response = {
                            error: true,
                            path: req.path,
                            method: req.method,
                            data: {
                                pid: pid
                            },
                            status: HttpStatusCode.NOT_FOUND,
                            msg: `not found information shop`
                        }
                        Log.default(response);
                        await res.status(HttpStatusCode.NOT_FOUND).send(response);
                    } else {
                        const { price, displayName, quantily, description } = await req.body;
                        const classify = new Classify({
                            price: price,
                            displayName: displayName,
                            quantily: quantily,
                            description: description,
                            uid: auth.uid,
                            sid: shop._id.toString(),
                            pid: product
                        });
                        const error = await classify.validateSync();
                        if (error) {
                            const response = {
                                error: true,
                                path: req.path,
                                method: req.method,
                                data: {
                                    price: price,
                                    displayName: displayName,
                                    quantily: quantily,
                                    description: description,
                                    error: error
                                },
                                status: HttpStatusCode.BAD_REQUEST,
                                msg: `body property format wrong!`
                            }
                            Log.default(response);
                            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                        } else {
                            const newClassify = await classify.save();
                            const response = {
                                error: false,
                                path: req.path,
                                method: req.method,
                                data: newClassify,
                                status: HttpStatusCode.OK,
                                msg: `create new classify success!`
                            }
                            Log.default(response);
                            await res.status(HttpStatusCode.OK).send(response);
                        }
                    }
                } else {
                    const response = {
                        error: true,
                        path: req.path,
                        method: req.method,
                        data: {
                            pid: pid
                        },
                        status: HttpStatusCode.NOT_FOUND,
                        msg: `not found information product with pid: ${pid}`
                    }
                    Log.default(response);
                    await res.status(HttpStatusCode.NOT_FOUND).send(response);
                }
            });
        } else {
            const response = {
                error: true,
                path: req.path,
                method: req.method,
                data: {
                    pid: pid
                },
                status: HttpStatusCode.BAD_REQUEST,
                msg: `param format wrong! with pid: ${pid}`
            }
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        }
    }



    public update(req: IRequest, res: IResponse) {

    }



    public destroy(req: IRequest, res: IResponse) {

    }

}


export default new ClassifyController;