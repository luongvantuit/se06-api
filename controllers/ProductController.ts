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

class ProductController extends IController {

    public async index(req: IRequest, res: IResponse) {
        const {
            sid
        } = await req.params;
        const {
            limit,
            page,
            category
        } = await req.query;
        const mLimit: number = Number(limit ?? 10);
        const mPage: number = Number(page ?? 0);
        if (!sid) {
            if (!category) {
                const products = await Product.find({ deleted: false }).skip(mLimit * mPage).limit(mLimit);
                const countDocuments: number = await (await Product.find({ deleted: false })).length;
                const maxPage: number = Math.ceil(countDocuments / mLimit);
                const response = {
                    error: false,
                    data: products,
                    maxPage: maxPage,
                    path: req.path,
                    method: req.method,
                    status: HttpStatusCode.OK,
                    msg: `get products success!`
                };
                Log.default(response);
                await res.status(HttpStatusCode.OK).send(response);
            } else {
                const findProducts = await Product.find({ deleted: false });
                const products: Array<any> = [];
                for (let x = 0; x < findProducts.length && (x < mLimit * mPage + mLimit); x++) {
                    var categories: string[] = findProducts[x].categories ?? [];
                    for (let y = 0; y < categories.length; y++) {
                        if (categories[y] === category) {
                            products.push(findProducts[x]);
                        }
                    }
                }
                const countDocuments: number = products.length;
                const maxPage: number = Math.ceil(countDocuments / mLimit);
                const response = {
                    error: false,
                    data: products,
                    maxPage: maxPage,
                    path: req.path,
                    method: req.method,
                    status: HttpStatusCode.OK,
                    msg: `get products success! with category: ${category}`
                }
                Log.default(response);
                await res.status(HttpStatusCode.OK).send(response);
            }
        } else {
            if (!category) {
                const products = await Product.find({ sid: sid, deleted: false }).skip(mLimit * mPage).limit(mLimit);
                const countDocuments: number = await (await Product.find({ sid: sid, deleted: false })).length;
                const maxPage: number = Math.ceil(countDocuments / mLimit);
                const response = {
                    error: false,
                    data: products,
                    maxPage: maxPage,
                    path: req.path,
                    method: req.method,
                    status: HttpStatusCode.OK,
                    msg: `get products success! with sid: ${sid}`
                };
                Log.default(response);
                await res.status(HttpStatusCode.OK).send(response);
            } else {
                const findProducts = await Product.find({ sid: sid, deleted: false });
                const products: Array<any> = [];
                for (let x = 0; x < findProducts.length && (x < mLimit * mPage + mLimit); x++) {
                    var categories: string[] = findProducts[x].categories ?? [];
                    for (let y = 0; y < categories.length; y++) {
                        if (categories[y] === category) {
                            products.push(findProducts[x]);
                        }
                    }
                }
                const countDocuments: number = products.length;
                const maxPage: number = Math.ceil(countDocuments / mLimit);
                const response = {
                    error: false,
                    data: products,
                    maxPage: maxPage,
                    path: req.path,
                    method: req.method,
                    status: HttpStatusCode.OK,
                    msg: `get all products of shop sid: ${sid} success! with category: ${category}`
                }
                Log.default(response);
                await res.status(HttpStatusCode.OK).send(response);
            }
        }
    }

    public async create(req: IRequest, res: IResponse) {
        const { sid } = await req.params;
        const {
            description,
            displayName,
            photos,
            address,
            classifies,
            categories,
        } = await req.body;
        if (!ObjectId.isValid(sid)) {
            const response = {
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
            await Token.verify(req, res, async (req, res, auth) => {
                const shop = await Shop.findOne({ _id: sid, deleted: false });
                if (!shop || shop.uid !== auth.uid) {
                    const response = {
                        error: true,
                        status: HttpStatusCode.NOT_FOUND,
                        path: req.path,
                        method: req.method,
                        data: {
                            sid: sid
                        },
                        msg: `not found information shop with sid: ${sid}`
                    };
                    Log.default(response);
                    await res.status(HttpStatusCode.NOT_FOUND).send(response);
                } else {
                    const product = new Product({
                        sid: sid,
                        description: description,
                        displayName: displayName,
                        photos: photos,
                        address: address,
                        classifies: classifies,
                        categories: categories,
                        date: Date.now(),
                    })
                    const error = await product.validateSync();
                    if (!error) {
                        var quantily = 0;
                        for (let index = 0; index < product.classifies.length; index++) {
                            if (!ObjectId.isValid(product.classifies[index])) {
                                const response = {
                                    error: true,
                                    status: HttpStatusCode.BAD_REQUEST,
                                    path: req.path,
                                    method: req.method,
                                    data: {
                                        description: description,
                                        displayName: displayName,
                                        photos: photos,
                                        address: address,
                                        classifies: classifies,
                                        categories: categories,
                                    },
                                    msg: 'body format wrong!'
                                }
                                await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                                return;
                            } else {
                                const clazz = await Classify.findOne({ _id: product.classifies[index], deleted: false })
                                if (clazz) {
                                    quantily += clazz.quantity;
                                } else {
                                    const response = {
                                        error: true,
                                        path: req.path,
                                        method: req.method,
                                        status: HttpStatusCode.NOT_FOUND,
                                        data: {
                                            classify: product.classifies[index],
                                        },
                                        msg: `not found information classify with id: ${product.classifies[index]}`
                                    }
                                    Log.default(response);
                                    await res.status(HttpStatusCode.NOT_FOUND).send(response);
                                    return
                                }
                            }
                        }
                        if (quantily > 0) {
                            product.state = 'in-stock';
                        } else {
                            product.state = 'out-of-stock';
                        }
                        const newProduct = await product.save();
                        const response = {
                            error: false,
                            data: newProduct,
                            status: HttpStatusCode.OK,
                            path: req.path,
                            method: req.method,
                            msg: `add new product to shop with sid: ${sid} success!`
                        };
                        Log.default(response);
                        await res.status(HttpStatusCode.OK).send(response);
                    } else {
                        const response = {
                            error: true,
                            data: error,
                            status: HttpStatusCode.BAD_REQUEST,
                            path: req.path,
                            method: req.method,
                            msg: `body property format wrong!`
                        };
                        Log.default(response);
                        await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                    }
                }
            });
        }
    }

    public async destroy(req: IRequest, res: IResponse) {
        const { pid } = await req.params;
        if (!ObjectId.isValid(pid)) {
            const response = {
                error: true,
                status: HttpStatusCode.BAD_REQUEST,
                path: req.path,
                method: req.method,
                data: {
                    pid: pid
                },
                msg: `param format wrong! pid: ${pid}`
            };
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        } else {
            await Token.verify(req, res, async (req, res, auth) => {
                const product = await Product.findOne({ _id: pid, deleted: false });
                if (!product) {
                    const response = {
                        error: true,
                        status: HttpStatusCode.NOT_FOUND,
                        path: req.path,
                        method: req.method,
                        data: {
                            pid: pid,
                        },
                        msg: `not found inforamtion of product with pid: ${pid}`
                    };
                    Log.default(response);
                    await res.status(HttpStatusCode.NOT_FOUND).send(response);
                } else {
                    const shop = await Shop.findOne({ _id: product.sid, deleted: false });
                    if (!shop || shop.uid !== auth.uid) {
                        const response = {
                            error: true,
                            status: HttpStatusCode.NOT_FOUND,
                            path: req.path,
                            method: req.method,
                            data: {
                                pid: pid
                            },
                            msg: `not found information of shop`
                        };
                        Log.default(response);
                        await res.status(HttpStatusCode.NOT_FOUND).send(response);
                    } else {
                        product.deleted = true;
                        const oldProduct = await product.save();
                        const response = {
                            error: false,
                            data: oldProduct,
                            status: HttpStatusCode.OK,
                            method: req.method,
                            path: req.method,
                            msg: `delete success product with pid: ${pid}`
                        }
                        Log.default(response);
                        await res.status(HttpStatusCode.OK).send(response);
                    }
                }

            });
        }
    }

    public async update(req: IRequest, res: IResponse) {
        const { pid } = await req.params;
        const {
            description,
            displayName,
            photos,
            address,
            classifies,
            categories,
            state,
        } = await req.body;
        if (!ObjectId.isValid(pid)) {
            const response = {
                error: true,
                status: HttpStatusCode.BAD_REQUEST,
                path: req.path,
                method: req.method,
                data: {
                    pid: pid
                },
                msg: `param format wrong! pid: ${pid}`
            };
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        } else {
            await Token.verify(req, res, async (req, res, auth) => {

                const product = await Product.findById(pid);
                if (!product) {
                    const response = {
                        error: true,
                        status: HttpStatusCode.NOT_FOUND,
                        path: req.path,
                        method: req.method,
                        data: {
                            pid: pid
                        },
                        msg: `not found information of product with pid: ${pid}`
                    }
                    Log.default(response)
                    await res.status(HttpStatusCode.NOT_FOUND).send(response);
                } else {
                    const shop = await Shop.findOne({ _id: product.sid, deleted: false });
                    if (!shop || shop.uid !== auth.uid) {
                        const response = {
                            error: true,
                            status: HttpStatusCode.NOT_FOUND,
                            path: req.path,
                            method: req.method,
                            data: {
                                pid: pid
                            },
                            msg: `not found information of shop!`
                        }
                        Log.default(response);
                        await res.status(HttpStatusCode.NOT_FOUND).send(response);
                    } else {
                        product.description = description ?? product.description;
                        product.displayName = displayName ?? product.displayName;
                        product.photos = photos ?? product.photos;
                        product.address = address ?? product.address;
                        product.classifies = classifies ?? product.classifies;
                        product.categories = categories ?? product.categories;
                        product.state = state ?? product.state;
                        const error = await product.validateSync();
                        if (!error) {
                            var quantily = 0;
                            for (let index = 0; index < product.classifies.length; index++) {
                                if (!ObjectId.isValid(product.classifies[index])) {
                                    const response = {
                                        error: true,
                                        status: HttpStatusCode.BAD_REQUEST,
                                        path: req.path,
                                        method: req.method,
                                        data: {
                                            description: description,
                                            displayName: displayName,
                                            photos: photos,
                                            address: address,
                                            classifies: classifies,
                                            categories: categories,
                                            state: state
                                        },
                                        msg: 'body format wrong!'
                                    }
                                    await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                                    return;
                                } else {
                                    const clazz = await Classify.findOne({ _id: product.classifies[index] })
                                    if (clazz) {
                                        quantily += clazz.quantity;
                                    } else {
                                        const response = {
                                            error: true,
                                            path: req.path,
                                            method: req.method,
                                            status: HttpStatusCode.NOT_FOUND,
                                            data: {
                                                classify: product.classifies[index],
                                            },
                                            msg: `not found information classify with id: ${product.classifies[index]}`
                                        }
                                        Log.default(response);
                                        await res.status(HttpStatusCode.NOT_FOUND).send(response);
                                        return
                                    }
                                }
                            }
                            if (quantily > 0) {
                                product.state = 'in-stock';
                            } else {
                                product.state = 'out-of-stock';
                            }
                            const newProduct = await product.save();
                            const response = {
                                error: false,
                                data: newProduct,
                                status: HttpStatusCode.OK,
                                path: req.path,
                                method: req.method,
                                msg: `update success! product with pid: ${pid}`
                            };
                            Log.default(response);
                            await res.status(HttpStatusCode.OK).send(response);
                        } else {
                            const response = {
                                error: true,
                                data: {
                                    error: error,
                                    description: description,
                                    displayName: displayName,
                                    photos: photos,
                                    address: address,
                                    classifies: classifies,
                                    categories: categories,
                                    state: state
                                },
                                status: HttpStatusCode.BAD_REQUEST,
                                path: req.path,
                                method: req.method,
                                msg: `body property format wrong!`
                            }
                            Log.default(response);
                            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                        }
                    }
                }
            });
        }
    }

    public async show(req: IRequest, res: IResponse) {
        const { pid } = await req.params;
        if (!ObjectId.isValid(pid)) {
            const response = {
                error: true,
                path: req.path,
                method: req.method,
                data: {
                    pid: pid
                },
                status: HttpStatusCode.BAD_REQUEST,
                msg: `param format wrong! pid: ${pid}`
            };
            Log.default(response);
            await res.status(HttpStatusCode.BAD_REQUEST).send(response);
        } else {
            const product = await Product.findById(pid);
            if (!product) {
                const response = {
                    error: true,
                    method: req.method,
                    path: req.path,
                    status: HttpStatusCode.NOT_FOUND,
                    data: {
                        pid: pid
                    },
                    msg: `not found product with pid ${pid}`
                }
                Log.default(response);
                await res.status(HttpStatusCode.NOT_FOUND).send(response);
            } else {
                const response = {
                    error: false,
                    data: product,
                    status: HttpStatusCode.OK,
                    path: req.path,
                    method: req.method,
                    msg: `success! get information product with pid: ${pid}`
                };
                Log.default(response);
                await res.status(HttpStatusCode.OK).send(response);
            }
        }
    }
}


export default new ProductController;