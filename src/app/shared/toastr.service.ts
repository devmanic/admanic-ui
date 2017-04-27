import { Injectable } from '@angular/core';
import * as toastr from 'toastr';

@Injectable()
export class ToastrService {

    public static error(message: string, title?: string, optionsOverride?: Object) {
        this._toastr.error(message, title, optionsOverride);
    }

    public static info(message: string, title?: string, optionsOverride?: Object) {
        this._toastr.info(message, title, optionsOverride);
    }

    public static success(message: string, title?: string, optionsOverride?: Object) {
        this._toastr.success(message, title, optionsOverride);
    }

    public static warning(message: string, title?: string, optionsOverride?: Object) {
        this._toastr.warning(message, title, optionsOverride);
    }

    public static clear() {
        this._toastr.clear();
    }

    private static _toastr = toastr;
}
