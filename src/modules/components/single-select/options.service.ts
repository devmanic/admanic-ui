import {Injectable} from '@angular/core';

@Injectable()
export class SingleSelectOptions {
    requestParamSearchKey: string = 'query'; // key in which be send search input value;
    requestParamLimitKey: string = 'limit'; // key in which be send search input value;
    requestParams: any = {}; // get params of request
    requestHeaders: any; // custom headers for request
    requestResponseMapFn: Function = (el: any) => ({
        label: el.title,
        value: el.id
    });
    requestResponseArrayKey: string = 'data'; // the name of the field which contain array
    pagination: boolean; // should use limitKey in request
    server: string = ''; // server for ajax request

    constructor() {

    }
}