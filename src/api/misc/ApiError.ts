/**
 * Simple error wrapper class to normalize error cases
 */
export default class ApiError {

    /**
     * http status code
     */
    public status: number;

    /**
     * error message
     */
    public message: string;

    /**
     * error data
     */
    public data: any;

    constructor(status: number, message: string, data: any) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
