import IRequest from "../interfaces/vendors/IRequest";
import IResponse from "../interfaces/vendors/IResponse";

class AccountController {
  public index(req: IRequest, res: IResponse): void {
    res.end();
  }
}

export default new AccountController;
