import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";

class UploadMultiFileController extends IController {
    public create(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): void {

    }
}