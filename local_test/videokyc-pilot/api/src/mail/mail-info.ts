export class MailInfo {
    to: string;
    //Template Context is a json object. key will be use in handlebar template to fill data
    teamplateContext: any;
    templateName: string;
    subject: string;
    attachments?: {
        filename: string;
        content?: any;
        path?: string;
        contentType?: string;
        cid?: string;
    }[];
    constructor(initialValues?: Partial<MailInfo>) {
        if (initialValues) {
            Object.assign(this, initialValues);
        }
    }
}