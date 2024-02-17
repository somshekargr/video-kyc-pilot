import { TextLocalClientConstants } from "./app.constants";

export class NewMessageRequest {
    private apikey: string;
    private sender: string;
    public numbers: string;
    public message: string;

    constructor(initialValues?: Partial<NewMessageRequest>) {
        this.apikey = TextLocalClientConstants.AppId;
        this.sender = TextLocalClientConstants.Sender;

        if (initialValues) {
            Object.assign(this, initialValues);
        }
    }
}