import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";
import Firebase from "../services/auths/Firebase";
import CodeResponse from "./CodeResponse";
import HttpStatusCode from "./HttpStatusCode";

class Token {
    public async verify(req: IRequest, res: IResponse, successed: (req: IRequest, res: IResponse, auth: DecodedIdToken) => void, failed?: (req: IRequest, res: IResponse) => void) {
        const { token } = await req.headers;
        if (!token) {
            if (!failed) {
                res.status(HttpStatusCode.UNAUTHORIZED).send({
                    code: CodeResponse.TOKEN_HEADER_EMPTY,
                    error: true,
                });
            } else {
                failed(req, res);
            }
        } else {
            try {
                const auth: DecodedIdToken = await Firebase.auth().verifyIdToken(token.toString(), true);
                successed(req, res, auth);
            }
            catch (error: any) {
                if (!failed) {
                    res.status(HttpStatusCode.UNAUTHORIZED).send({
                        code: CodeResponse.TOKEN_VERIFY_FAILED,
                        error: true,
                    });
                } else {
                    failed(req, res);
                }
            }
        }
    }
}

export default new Token;