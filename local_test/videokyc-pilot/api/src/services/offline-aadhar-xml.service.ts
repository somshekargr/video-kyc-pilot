import { HttpException, Injectable } from '@nestjs/common';
import * as unzipper from 'unzipper';
import * as xml2json from 'xml2json';
import * as moment from 'moment';
import { createHash } from 'crypto';
import { AadharUploadDTO } from 'src/dto/aadhar-upload.dto';
import { AadharDataDTO } from 'src/dto/aadhar-data.dto';
import { APIResponse } from 'src/dto/api-response';
import { ErrorDTO } from 'src/dto/error.dto';
import { appConfig } from 'src/config/app-config';

// XML Signature stuff. Uncomment once implemented
// import { readFileSync } from 'fs';
// import * as XAdES from 'xadesjs';
// import { Crypto } from '@peculiar/webcrypto';

// const crypto = new Crypto();
// XAdES.Application.setEngine('NodeJS', crypto);


@Injectable()
export class OfflineAadharXmlService {
    async parse(buffer: Buffer, aadharUploadDTO: AadharUploadDTO): Promise<APIResponse<AadharDataDTO | ErrorDTO>> {
        const zipArchive = await unzipper.Open.buffer(buffer);

        let extractedXml;

        try {
            extractedXml = (
                await zipArchive.files[0].buffer(aadharUploadDTO.passPhrase)
            ).toString();
        } catch (error) {
            let errorResponse = new APIResponse<null>({ error: 'Incorrect Passcode. Please provide a correct passcode', success: false, statusCode: 500 });
            return errorResponse;
        }

        if (this.isValidXmlSignature(extractedXml)) {
            const aadharData = <any>xml2json.toJson(extractedXml, {
                object: true,
            }).OfflinePaperlessKyc;


            // When the invalid zip file is uploaded. We get undefined as data
            if (aadharData == undefined) {
                let errorResponse = new APIResponse<null>({ error: 'Incorrect Aadhar XML File. Please upload a valid zip file.', success: false, statusCode: 500 });
                return errorResponse;
            }


            // Remove the signature object
            delete aadharData.Signature;

            const referenceId = <string>aadharData.referenceId;

            // The generated date is in YYYYMMDDhhmmss format from 5th character to 19th character of referenceId
            const dateStr = referenceId.substr(4, referenceId.length - 7);

            // Format: 4 digits year, 2 digits month, 2 digits day, 2 digits hour (1 to 24), 2 digits minute and 2 digits seconds
            const aadharXmlGeneratedDate = moment(dateStr, 'YYYYMMDDkkmmss');

            const today = moment();

            const diffDays = today.diff(aadharXmlGeneratedDate, 'days');

            // If generated date is before 3 days, then we reject
            if (diffDays > appConfig.aadharXmlUploadConfig.rejectAadharXmlOlderThanDays) {
                let errorResponse = new APIResponse<null>({ error: `Uploaded Aadhar XML file is older than ${appConfig.aadharXmlUploadConfig.rejectAadharXmlOlderThanDays} days.`, success: false, statusCode: 500 });
                return errorResponse;
            }

            // The first 4 digits of referenceId is actually last 4 digits of aadhar number
            // The last digit of the aadhar number is used as the number of times has needs
            // to be applied in a loop
            const numTimesToHash = parseInt(referenceId.substr(3, 1));

            //If Mobile Number is linked to Aadhar aadharData.UidData.Poi.e will have some hash value. then only we do the hash matching. 
            if (aadharData.UidData.Poi.m?.trim()?.length > 0) {
                {
                    if (
                        !this.isMatchingHash(
                            aadharUploadDTO.mobile,
                            aadharUploadDTO.passPhrase,
                            numTimesToHash,
                            aadharData.UidData.Poi.m,
                        )
                    ) {
                        let errorResponse = new APIResponse<null>({ error: 'Your Email id is not registered with the aadhaar', success: false, statusCode: 500 });
                        return errorResponse;
                    }
                }
            }


            if (aadharUploadDTO.email?.trim()?.length > 0) {

                //If Email is linked to Aadhar aadharData.UidData.Poi.e will have some hash value. then only we do the hash matching. 
                if (aadharData.UidData.Poi.e?.trim()?.length > 0) {
                    if (
                        !this.isMatchingHash(
                            aadharUploadDTO.email,
                            aadharUploadDTO.passPhrase,
                            numTimesToHash,
                            aadharData.UidData.Poi.e,
                        )
                    ) {
                        let errorResponse = new APIResponse<null>({ error: 'Your mobile number is not registered with the aadhaar', success: false, statusCode: 500 });
                        return errorResponse;
                    }
                }
            }

            aadharData.UidData.Poi.mobile = aadharUploadDTO.mobile;
            aadharData.UidData.Poi.email = aadharUploadDTO.email;

            delete aadharData.UidData.Poi.e;
            delete aadharData.UidData.Poi.m;

            aadharData.UidData.referenceId = referenceId;
            aadharData.UidData.generatedDate = aadharXmlGeneratedDate.toDate();

            let retVal = new APIResponse<AadharDataDTO>({ data: aadharData.UidData });
            return retVal;
        }
    }

    private isMatchingHash(
        value: string,
        passPhrase: string,
        numTimesToHash: number,
        hashedValue: string,
    ): boolean {
        if (numTimesToHash < 1) {
            numTimesToHash = 1;
        }

        let hashValue = `${value}${passPhrase}`;

        for (let i = 0; i < numTimesToHash; i++) {
            hashValue = this.sha256Hash(hashValue);
        }

        return hashedValue === hashValue;
    }

    private sha256Hash(val: string): string {
        const hash = createHash('sha256');
        hash.setEncoding('utf-8');
        hash.write(val);
        return hash.digest('hex');
    }

    // private preparePem(pem): string {
    //   return (
    //     pem
    //       // remove BEGIN/END
    //       .replace(/-----(BEGIN|END)[\w\d\s]+-----/g, '')
    //       // remove \r, \n
    //       .replace(/[\r\n]/g, '')
    //   );
    // }

    // private pem2der(pem): ArrayBufferLike {
    //   pem = this.preparePem(pem);
    //   // convert base64 to ArrayBuffer
    //   return new Uint8Array(Buffer.from(pem, 'base64')).buffer;
    // }

    private async isValidXmlSignature(xmlString: string): Promise<boolean> {
        // TODO: Fix issue with XML Signature validation and uncomment code here

        // const keyPem = readFileSync('./data/uidai_auth_sign_prod_2023.pem', 'utf8');

        // const alg = { name: 'RSA-PSS', hash: { name: 'SHA-256' } };

        // const keyDer = this.pem2der(keyPem);

        // const key = await crypto.subtle.importKey('pkcs8', keyDer, alg, false, [
        //   'verify',
        // ]);

        // const signedDocument = XAdES.Parse(xmlString);

        // const xmlSignature = signedDocument.getElementsByTagNameNS(
        //   'http://www.w3.org/2000/09/xmldsig#',
        //   'Signature',
        // );

        // const signedXml = new XAdES.SignedXml(signedDocument);

        // signedXml.LoadXml(xmlSignature[0]);

        // signedXml
        //   .Verify(key)
        //   .then((res) => {
        //     console.log((res ? 'Valid' : 'Invalid') + ' signature');
        //   })
        //   .catch(function (e) {
        //     console.error(e);
        //   });

        return true;
    }
}
