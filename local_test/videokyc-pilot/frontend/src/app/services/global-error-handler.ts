import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, ErrorHandler, NgZone } from "@angular/core";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(
        private zone: NgZone
    ) { }

    handleError(error: any) {
        debugger;
        // Check if it's an error from an HTTP response
        if (!(error instanceof HttpErrorResponse)) {
            error = error.rejection; // get the error object
        }
        this.zone.run(() => {
            console.log("Error Occured ", error);
        }
        );

        console.error('Error from global error handler', error);
    }
}