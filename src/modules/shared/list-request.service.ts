import { isNil, isArray } from 'lodash';
import { Injectable } from '@angular/core';
import { ListRequest } from './list-request.model';

@Injectable()
export class ListRequestService {
    public static parseRequestObject(requestObj: ListRequest, ajax?: boolean) {
        this.str = '';
        if (ajax) {
            this.parse(requestObj);
            return this.str;
        } else {
            this.parse(requestObj);
            return this.str ? '?' + this.str : '';
        }
    }

    private static str: string;

    private static parse(requestObj) {
        for (let keyObj in requestObj) {
            if (!isNil(requestObj[keyObj]) && requestObj[keyObj] !== '') {
                if (isArray(requestObj[keyObj])) {
                    if (requestObj[keyObj].length > 0) {
                        let pairs = [];
                        for (let key in requestObj[keyObj]) {
                            if (requestObj[keyObj].hasOwnProperty(key) && !isNil(requestObj[keyObj][key])) {
                                pairs.push(keyObj + '[]' + '=' + encodeURIComponent(requestObj[keyObj][key]));
                            }
                        }
                        if (pairs.length > 0) {
                            this.str += '&' + pairs.join('&');
                        }
                    }
                } else {
                    if (this.str !== '') {
                        this.str += '&';
                    }
                    this.str += keyObj + '=' + encodeURIComponent(requestObj[keyObj]);
                }
            }
        }
    }
}
