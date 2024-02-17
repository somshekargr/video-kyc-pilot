import { Injectable } from '@nestjs/common';
import { MailInfo } from 'src/mail/mail-info';
import * as sgMail from '@sendgrid/mail';
import { appConfig } from 'src/config/app-config';
var Handlebars = require('handlebars');
import { MailDataRequired } from '@sendgrid/mail';

@Injectable()
export class MailService {
    constructor() { }

    async sendEmail(mailInfo: MailInfo) {
        if (appConfig.emailConfig.enabled) {
            try {
                let apiKey = appConfig.emailConfig.sendGridApiKey;
                sgMail.setApiKey(apiKey);

                let mailData = await this.getMailData(mailInfo);

                sgMail
                    .send(mailData)
                    .then(() => {
                        console.log('Email sent successfully')
                    })
                    .catch((error) => {
                        console.error("Error occured while sending email : " + error);
                    });

            } catch (error) {
                console.error("Error occured while sending email : " + error);
            }
        } else {
            console.info('Email sending feature is disabled. Please enable to use it');
        }
    }

    private async getMailData(mailInfo: MailInfo): Promise<sgMail.MailDataRequired> {
        const emailTemplatePath = `assets/mail-templates/${mailInfo.templateName}.hbs`;
        const fsPromises = require('fs').promises;

        const templateFile = await fsPromises.readFile(emailTemplatePath)
            .catch((err: any) => console.error('Failed to read the template file file', err));

        var template = Handlebars.compile(templateFile.toString());

        let html = template({ ...mailInfo.teamplateContext })

        const mailData: MailDataRequired = {
            to: mailInfo.to,
            from: appConfig.emailConfig.defaults.from,
            subject: mailInfo.subject,
            html: html,
        };

        return mailData;
    }
}