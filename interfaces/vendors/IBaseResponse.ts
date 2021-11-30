interface IBaseResponse<T> {
    error: boolean;
    message: string;
    data?: T;
}

export default IBaseResponse;