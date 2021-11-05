import { Response } from "express";

interface IResponse<
  ResBody = any,
  Locals extends Record<string, any> = Record<string, any>
> extends Response<ResBody, Locals> {}

export default IResponse;
