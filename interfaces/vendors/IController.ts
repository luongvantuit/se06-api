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

    public index(req: IRequest, res: IResponse): any {

    };

    /**
    * METHOD GET
    */

    public create(req: IRequest, res: IResponse): any {

    };

    /**
    * METHOD POST
    */

    public store(req: IRequest, res: IResponse): any {

    };


    /**
    * METHOD GET
    */

    public show(req: IRequest, res: IResponse): any {

    };

    /**
    * METHOD GET
    */

    public edit(req: IRequest, res: IResponse): any {

    };

    /**
    * METHOD PUT/PATCH
    */

    public update(req: IRequest, res: IResponse): any {

    };

    /**
    * METHOD DELETE
    */

    public destroy(req: IRequest, res: IResponse): any {

    };
}


export default IController;