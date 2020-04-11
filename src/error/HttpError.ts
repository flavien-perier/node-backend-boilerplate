import { Response } from "express";

export default abstract class HttpError extends Error {
    constructor(
        protected statusMessage: string
    ) {
        super(statusMessage);
    }

    protected abstract get statusCode(): number;

    public apply(res: Response) {
        res.statusMessage = this.statusMessage;
        res.status(this.statusCode).end();
    }
}
