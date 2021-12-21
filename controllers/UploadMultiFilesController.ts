import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import CodeResponse from "../perform/CodeResponse";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";
import { uploadMultiFiles } from "../services/upload/Multer";

class UploadMultiFilesController extends IController {
    public async create(req: IRequest<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: IResponse<any, Record<string, any>>): Promise<void> {
        return await Token.verify(req, res, (req, res) => {
            uploadMultiFiles(req, res, (error) => {
                if (error === undefined)
                    return res.status(HttpStatusCode.OK)
                        .send({
                            error: false,
                            data: req.files
                        })
                        .end()
                else
                    return res.status(HttpStatusCode.OK)
                        .send({
                            error: true,
                            code: CodeResponse.UPLOAD_ERROR
                        })
                        .end();
            })
        })
    }
}


export default new UploadMultiFilesController;