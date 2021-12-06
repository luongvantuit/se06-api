interface IRate {
    userId: String;
    rateCurrency: String;
    rates: [{
        rate: Number;
        msg: String;
        date: Date;
    }];
    productId: String;
}

export default IRate;
