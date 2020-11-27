
import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
    
    // Private errors = this.errors = errors
    constructor(public errors: ValidationError[]) {
        super();

        // only becase we extend a built in class in ts
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

}
