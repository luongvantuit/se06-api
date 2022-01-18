import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import CodeResponse from "../perform/CodeResponse";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";
import { uploadMultiFiles } from "../services/Multer";

class UploadMultiFilesController extends IController {
    /**
     * 
     * @param req 
     * @param res 
     */
    public async create(req: IRequest, res: IResponse) {
        await Token.verify(req, res, (req, res) => {
            uploadMultiFiles(req, res, (error) => {
                if (error) {
                    res
                        .status(HttpStatusCode.OK)
                        .send({
                            error: true,
                            code: CodeResponse.UPLOAD_ERROR
                        });
                }
                else {
                    res
                        .status(HttpStatusCode.OK)
                        .send({
                            error: false,
                            data: req.files
                        });
                }
            });
        });
    }
}


export default new UploadMultiFilesController;