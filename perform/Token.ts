import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Log from "../middlewares/Log";
import Firebase from "../services/auths/Firebase";
import HttpStatusCode from "./HttpStatusCode";

class Token {


    public async verify(req: IRequest, res: IResponse, successed: (req: IRequest, res: IResponse, auth: DecodedIdToken) => void) {
        const { token } = await req.headers;
        if (!token) {
            const response: any = {
                error: true,
                status: HttpStatusCode.UNAUTHORIZED,
                msg: `unauthorized! token in headers is empty`,
                path: req.path,
                method: req.method,
            };
            Log.default(response);
            await res.status(HttpStatusCode.UNAUTHORIZED).send(response);
        } else {
            try {
                const auth: DecodedIdToken = await Firebase.auth().verifyIdToken(token.toString(), true);
                Log.default(`success! token: ${token}`);
                successed(req, res, auth);
            }
            catch (error: any) {
                const response: any = {
                    error: true,
                    status: HttpStatusCode.UNAUTHORIZED,
                    msg: `unauthorized!`,
                    path: req.path,
                    method: req.method,
                    data: {
                        token: token,
                        error: error,
                    }
                };
                Log.default(response);
                await res.status(HttpStatusCode.UNAUTHORIZED).send(response);
            }
        }
    }
}

export default new Token;