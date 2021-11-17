interface IOrder {
    Products: [String];
    Date: Date;
    Status: Number;
    Expected: Date;
    ShippingUnitID: String;
    Vouchers: [String];
    Total: Number;
    ProductCost: Number;
    ShippingCost: Number;
    PlaceOfReceipt: String;
    UserID: String;
    ShopOwner: String;
}