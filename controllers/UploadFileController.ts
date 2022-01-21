import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Log from "../middlewares/Log";
import HttpStatusCode from "../perform/HttpStatusCode";
import Token from "../perform/Token";
import { uploadFile } from "../services/Multer";

class UploadFileController extends IController {
    public async create(req: IRequest, res: IResponse) {
        await Token.verify(req, res, (req, res) => {
            uploadFile(req, res, async (error) => {
                if (error) {
                    const response: any = {
                        error: true,
                        status: HttpStatusCode.BAD_REQUEST,
                        path: req.path,
                        method: req.method,
                        msg: 'upload failed!',
                        data: {
                            error: error
                        }
                    };
                    Log.default(response);
                    await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                }
                else {
                    const response: any = {
                        error: false,
                        data: req.file,
                        status: HttpStatusCode.OK,
                        path: req.path,
                        method: req.method,
                        msg: 'upload success!'
                    };
                    Log.default(response)
                    await res.status(HttpStatusCode.OK).send(response);
                }
            });
        });
    }
}

export default new UploadFileController;