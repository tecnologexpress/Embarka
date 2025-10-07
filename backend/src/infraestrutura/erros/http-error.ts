export class HttpErro extends Error {
    public details?: any;
    constructor(public status: number, prm_message: string, prm_details?: any) {
        super(prm_message)
        this.name = this.constructor.name;
        this.details = prm_details;
    }
}