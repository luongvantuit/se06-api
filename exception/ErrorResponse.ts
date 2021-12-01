import IResCode from "../interfaces/vendors/IResCode";
import CodeError from "./CodeError";

const ErrorResponse: Map<CodeError, IResCode> = new Map<CodeError, IResCode>([
    [
        CodeError.TOKEN_HEADER_EMPTY, {
            code: "token/header/empty",
            error: true,
            message: "Oh no! Unauthorized by token in headers is empty"
        },

    ],
    [
        CodeError.TOKEN_VERIFY_FAILED, {
            code: "token/verify/failed",
            error: true,
            message: "Oh no! Token verify failed"
        }
    ],
    [
        CodeError.USER_INFORMATION_EMPTY, {
            code: "user/information/empty",
            error: true,
            message: "Oh no! User has not updated information"
        },

    ],
    [
        CodeError.BODY_PROPERTY_EMPTY, {
            code: "body/property/empty",
            error: true,
            message: "Oh no! Property required empty"
        },
    ],
    [
        CodeError.PROPERTY_RATE_GREATER_THAN_5, {
            code: "property/rate/greater/than/5",
            error: true,
            message: "Oh no! Property rate not greater than 5"
        },
    ],
    [
        CodeError.PARAM_WRONG_FORMAT, {
            code: "param/wrong/formmat",
            error: true,
            message: "Oh no! Param wrong format"
        },
    ],
    [
        CodeError.PRODUCT_NOT_FOUND, {
            code: "product/not/found",
            error: true,
            message: "Oh no! Product not found"
        },
    ],
    [
        CodeError.PRODUCT_NOT_PURCHASED, {
            code: "product/not/purchased",
            error: true,
            message: "Oh no! The product has not been purchased before",
        }
    ],
    [
        CodeError.BODY_PROPERTY_WRONG_FORMAT, {
            code: "body/property/wrong/format",
            error: true,
            message: "Oh no! Body property wrong format",
        }
    ]
])

export default ErrorResponse;