import { Document, model, Model, Schema } from "mongoose";
import IUsedVoucher from "../interfaces/models/IUsedVoucher";

interface IUsedVoucherModel extends IUsedVoucher, Document {

}

const UsedVoucherSchema: Schema = new Schema({
    voucherID: { type: String },
    userID: { type: String },
})

const UsedVoucher: Model<IUsedVoucherModel> = model<IUsedVoucherModel>('UsedVoucher', UsedVoucherSchema);

export default UsedVoucher;