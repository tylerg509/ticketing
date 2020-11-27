
import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';



export class RequestValidationError extends CustomError {
    statusCode = 400;
    // Private errors = this.errors = errors
    constructor(public errors: ValidationError[]) {
        super('Invalid request params');

        // only becase we extend a built in class in ts
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map( err => {
            return { message: err.msg, field: err.param }
        })
    }

}
