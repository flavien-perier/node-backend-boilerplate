import HttpError from "./HttpError";

export default class HttpInternalServerError extends HttpError {
    public get statusCode() {
        return 500;
    }
}
