import { Injectable } from '@angular/core';

@Injectable()
export class SingleSelectOptions {
    baseAjaxQuery: any = {};
    pagination: boolean;
    server: string = '';
    authToken: string;

    constructor() {

    }
}