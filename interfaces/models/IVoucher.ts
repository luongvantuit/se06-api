interface IVoucher {
    category: Number;
    categoryProduct: Number;
    shippingUnitID: String;
    date: Date;
    expired: Date;
    amount: Number;
    value: Number;
    productID: String;
    shopID: String;
}

export default IVoucher;