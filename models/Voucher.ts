import { Document, model, Model, Schema } from "mongoose";
import IVoucher from "../interfaces/models/IVoucher";

interface IVoucherModel extends IVoucher, Document {

}

const VoucherSchema: Schema = new Schema({
    category: { type: Number },
    categoryProduct: { type: Number },
    shippingUnitID: { type: String },
    date: { type: Date },
    expired: { type: Date },
    amount: { type: Number },
    value: { type: Number },
    shopID: { type: String },
    productID: { type: String },
})

const Voucher: Model<IVoucherModel> = model<IVoucherModel>('Voucher', VoucherSchema);

export default Voucher;