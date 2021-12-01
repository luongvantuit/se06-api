import IResCode from "./IResCode";

interface IBaseResponse<T> extends IResCode {
    data?: T;
}

export default IBaseResponse;