import IUser from "../interfaces/models/IUser";
import { Document } from "mongoose";

export interface IUserModel extends IUser, Document<Long> {

}