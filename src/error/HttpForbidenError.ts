import HttpError from "./HttpError";

export default class HttpForbidenError extends HttpError {
    public get statusCode() {
        return 403;
    }
}
