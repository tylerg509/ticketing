
import { ValidationError } from 'express-validator';

interface CustomError {
    statusCode: number;
    serializeErrors(): {
        message: string;
        field?: string;
    }[]
}

export class RequestValidationError extends Error implements CustomError {
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
