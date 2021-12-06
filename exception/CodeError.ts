enum CodeError {
    TOKEN_HEADER_EMPTY = "token/header/empty",
    TOKEN_VERIFY_FAILED = "token/verify/failed",
    USER_INFORMATION_EMPTY = "user/information/empty",
    BODY_PROPERTY_EMPTY = "body/property/empty",
    PROPERTY_RATE_GREATER_THAN_5 = "property/rate/greater/than/5",
    PARAM_WRONG_FORMAT = "param/wrong/formmat",
    PRODUCT_NOT_FOUND = "product/not/found",
    PRODUCT_NOT_PURCHASED = "product/not/purchased",
    BODY_PROPERTY_WRONG_FORMAT = "body/property/wrong/format",
    RECORD_EMAIL_EXISTED = "record/email/existed"
}

export default CodeError;