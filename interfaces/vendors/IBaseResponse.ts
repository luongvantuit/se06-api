interface IBaseResponse<T> {
    error: boolean;
    messages: string;
    data?: T;
}

export default IBaseResponse;