interface IBaseResponse<T> {
    error: boolean;
    code?: number;
    messages: string;
    data?: T;
}

export default IBaseResponse;