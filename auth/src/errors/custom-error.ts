
interface ISerializeErrorResponse {
    message: string;
    field?: string;
}

export abstract class CustomError extends Error {

    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, CustomError.prototype)
    }

    // must implement this
    abstract statusCode: number;
    abstract serializeErrors(): ISerializeErrorResponse[];
}