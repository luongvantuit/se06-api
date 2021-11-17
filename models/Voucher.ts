import { Document, model, Model, Schema } from "mongoose";
import IVoucher from "../interfaces/models/IVoucher";

interface IVoucherModel extends IVoucher, Document {

}

const VoucherSchema: Schema = new Schema({
    Category: { type: Number },
    CategoryProduct: { type: Number },
    ShippingUnitID: { type: String },
    Date: { type: Date },
    Expired: { type: Date },
    Amount: { type: Number },
    Value: { type: Number }
})

const Voucher: Model<IVoucherModel> = model<IVoucherModel>('Voucher', VoucherSchema);

export default Voucher;