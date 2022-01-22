import { ObjectId } from "mongodb";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Log from "../middlewares/Log";
import Classify from "../models/Classify";
import HttpStatusCode from "../perform/HttpStatusCode";

class ClassifyController extends IController {

    public async index(req: IRequest, res: IResponse) {
        const { pid } = await req.params;
        const classifies = await Classify.find({ pid: pid });
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
            const classify = await Classify.findOne({ _id: cid });
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



    public create(req: IRequest, res: IResponse) {

    }



    public update(req: IRequest, res: IResponse) {

    }



    public destroy(req: IRequest, res: IResponse) {

    }

}


export default new ClassifyController;