
import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
    statusCode = 400;
    // Private errors = this.errors = errors
    constructor(public errors: ValidationError[]) {
        super();

        // only becase we extend a built in class in ts
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map( err => {
            return { message: err.msg, field: err.param }
        })
    }

}
