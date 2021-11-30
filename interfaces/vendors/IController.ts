import IRequest from "./IRequest";
import IResponse from "./IResponse";

/**
 * @author Lương Văn Tú
 * abstract class api controller
 */

abstract class IController {
    /**
     * METHOD GET
     */

    public index(req: IRequest, res: IResponse) {

    };

    /**
    * METHOD GET
    */

    public create(req: IRequest, res: IResponse) {

    };

    /**
    * METHOD POST
    */

    public store(req: IRequest, res: IResponse) {

    };


    /**
    * METHOD GET
    */

    public show(req: IRequest, res: IResponse) {

    };

    /**
    * METHOD GET
    */

    public edit(req: IRequest, res: IResponse) {

    };

    /**
    * METHOD PUT/PATCH
    */

    public update(req: IRequest, res: IResponse) {

    };

    /**
    * METHOD DELETE
    */

    public destroy(req: IRequest, res: IResponse) {

    };
}


export default IController;