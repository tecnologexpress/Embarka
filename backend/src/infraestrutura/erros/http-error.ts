export class HttpErro extends Error {
    public details?: any;
    constructor(public status: number, message: string, details?: any) {
        super(message)
        this.name = this.constructor.name;
        this.details = details;
    };
};