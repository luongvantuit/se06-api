import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import CodeResponse from "../perform/CodeResponse";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";
import { uploadFile } from "../services/Multer";

class UploadFileController extends IController {
    public async create(req: IRequest, res: IResponse) {
        return await Token.verify(req, res, (req, res) => {
            uploadFile(req, res, (error) => {
                if (error === undefined)
                    return res.status(HttpStatusCode.OK)
                        .send({
                            error: false,
                            data: req.file
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

export default new UploadFileController;