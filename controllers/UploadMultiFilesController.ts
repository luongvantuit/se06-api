import IController from "../interfaces/vendors/IController";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Log from "../middlewares/Log";
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
        await Token.verify(req, res, async (req, res) => {
            uploadMultiFiles(req, res, async (error) => {
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
                    }
                    Log.default(response);
                    await res.status(HttpStatusCode.BAD_REQUEST).send(response);
                }
                else {
                    const response: any = {
                        error: false,
                        data: req.files,
                        status: HttpStatusCode.OK,
                        path: req.path,
                        method: req.method,
                        msg: 'upload success!'
                    }
                    Log.default(response);
                    await res.status(HttpStatusCode.OK).send(response);
                }
            });
        });
    }
}


export default new UploadMultiFilesController;