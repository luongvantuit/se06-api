interface IOrder {
    products: [String];
    date: Date;
    status: Number;
    expected: Date;
    shippingUnitID: String;
    vouchers: [String];
    total: Number;
    productCost: Number;
    shippingCost: Number;
    placeOfReceipt: String;
    userID: String;
}

export default IOrder;